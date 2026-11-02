import { isActive, type CenterCandidate } from "@sos/domain";
import { ConflictError, NotFoundError } from "../src/application/errors.js";
import type {
  AssignmentRecord,
  CenterDirectory,
  IdentityProvider,
  LegacyUserRecord,
  Notifier,
  PushMessage,
  RequestRepository,
  RescueRequestRecord,
  RescueStore,
  RescueTx,
  ResponderRecord,
  Scheduler,
  TimerJob,
  UserDirectory,
  VerifiedToken,
} from "../src/application/ports.js";

/** Token "token-<uid>" verifies as <uid>; anything else is rejected. */
export class FakeIdentityProvider implements IdentityProvider {
  users = new Map<string, { email: string; displayName: string }>();
  claims = new Map<string, Record<string, unknown>>();
  deleted: string[] = [];
  private seq = 0;

  async verifyIdToken(token: string): Promise<VerifiedToken> {
    if (!token.startsWith("token-")) throw new Error("invalid token");
    const uid = token.slice("token-".length);
    return { uid, claims: this.claims.get(uid) ?? {} };
  }

  async createUser(input: { email: string; password: string; displayName: string }) {
    if ([...this.users.values()].some((u) => u.email === input.email)) {
      throw new ConflictError("EMAIL_EXISTS", "Email is already registered");
    }
    const uid = `new-${++this.seq}`;
    this.users.set(uid, { email: input.email, displayName: input.displayName });
    return { uid };
  }

  async deleteUser(uid: string) {
    this.users.delete(uid);
    this.deleted.push(uid);
  }

  async setClaims(uid: string, claims: Record<string, unknown>) {
    this.claims.set(uid, claims);
  }
}

export class InMemoryUserDirectory implements UserDirectory {
  docs = new Map<string, LegacyUserRecord>();
  failNextCreate = false;
  fcmTokens = new Map<string, Set<string>>();

  async get(uid: string) {
    return this.docs.get(uid) ?? null;
  }

  async create(uid: string, record: LegacyUserRecord) {
    if (this.failNextCreate) {
      this.failNextCreate = false;
      throw new Error("firestore unavailable");
    }
    if (this.docs.has(uid)) throw new Error("already exists");
    this.docs.set(uid, record);
  }

  async addFcmToken(uid: string, token: string) {
    this.fcmTokens.set(uid, (this.fcmTokens.get(uid) ?? new Set()).add(token));
  }
}

export class FakeScheduler implements Scheduler {
  jobs = new Map<string, TimerJob>();
  repeating = new Map<string, number>();
  healthy = true;
  private handler?: (job: Pick<TimerJob, "name" | "payload">) => Promise<void>;

  async schedule(job: TimerJob) {
    if (!this.jobs.has(job.id)) this.jobs.set(job.id, job);
  }

  async cancel(id: string) {
    this.jobs.delete(id);
  }

  async ping() {
    if (!this.healthy) throw new Error("redis down");
  }

  onTimer(handler: (job: Pick<TimerJob, "name" | "payload">) => Promise<void>) {
    this.handler = handler;
  }

  async scheduleEvery(name: TimerJob["name"], everyMs: number) {
    this.repeating.set(name, everyMs);
  }

  /** Fast-forwards a scheduled timer. */
  async fire(id: string) {
    await this.run(this.jobs.get(id)!);
  }

  async run(job: TimerJob) {
    await this.handler?.(job);
  }
}

export class FakeNotifier implements Notifier {
  sent: { uids: string[]; message: PushMessage }[] = [];

  async push(uids: string[], message: PushMessage) {
    this.sent.push({ uids, message });
  }
}

export class InMemoryRequests implements RequestRepository, RescueStore {
  docs = new Map<string, RescueRequestRecord>();
  assignments = new Map<string, AssignmentRecord>();
  responders = new Map<string, Omit<ResponderRecord, "uid">>();
  availableResponders = new Map<string, number>();
  private locks = new Set<string>();
  private seq = 0;

  newId() {
    return `req-${++this.seq}`;
  }

  /** Handlers check before they write, so a thrown error leaves nothing to roll back. */
  async run<T>(work: (tx: RescueTx) => Promise<T>) {
    return work({
      newAssignmentId: () => `assignment-${++this.seq}`,
      getRequest: async (id) => this.docs.get(id) ?? null,
      getAssignment: async (id) => this.assignments.get(id) ?? null,
      getResponder: async (uid) => {
        const record = this.responders.get(uid);
        return record ? { ...record, uid } : null;
      },
      setRequest: (record) => {
        this.docs.set(record.id, record);
        if (!isActive(record.status)) this.locks.delete(record.requesterId);
      },
      setAssignment: (record) => {
        this.assignments.set(record.id, record);
      },
      setResponder: ({ uid, ...record }) => {
        this.responders.set(uid, record);
      },
      adjustCenterResponders: (centerId, delta) => {
        this.availableResponders.set(centerId, (this.availableResponders.get(centerId) ?? 0) + delta);
      },
    });
  }

  async listPendingBefore(time: number) {
    return [...this.docs.values()].filter((r) => r.status === "PENDING" && r.createdAt < time).map((r) => r.id);
  }

  async listOfferedBefore(time: number) {
    return [...this.assignments.values()].filter((a) => a.status === "OFFERED" && a.offeredAt < time).map((a) => a.id);
  }

  async findByIdempotencyKey(requesterId: string, key: string) {
    return [...this.docs.values()].find((r) => r.requesterId === requesterId && r.idempotencyKey === key) ?? null;
  }

  async create(record: RescueRequestRecord) {
    if (this.locks.has(record.requesterId)) {
      throw new ConflictError("ACTIVE_REQUEST_EXISTS", "You already have an active request");
    }
    this.locks.add(record.requesterId);
    this.docs.set(record.id, record);
  }

  async update(id: string, change: (record: RescueRequestRecord) => RescueRequestRecord | null) {
    const current = this.docs.get(id);
    if (!current) throw new NotFoundError("REQUEST_NOT_FOUND", "Request not found");
    const next = change(current);
    if (!next) return null;
    const updated = { ...next, version: current.version + 1 };
    this.docs.set(id, updated);
    if (!isActive(updated.status)) this.locks.delete(updated.requesterId);
    return updated;
  }
}

export class FakeCenterDirectory implements CenterDirectory {
  items: CenterCandidate[] = [];

  async listApproved() {
    return this.items;
  }
}
