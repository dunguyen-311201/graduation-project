import type { IncidentCategory, RaiseSosBody } from "@sos/contracts";
import type { CenterCandidate, RequestStatus } from "@sos/domain";

/** The authenticated caller, built by the HTTP guard from a verified ID token. */
export interface Actor {
  uid: string;
  /** From custom claims (ADR-0004). Absent for accounts created before claims. */
  role?: string;
  centerId?: string;
}

export interface VerifiedToken {
  uid: string;
  claims: Record<string, unknown>;
}

/** Firebase Auth, behind a port so tests never touch the network. */
export interface IdentityProvider {
  verifyIdToken(token: string): Promise<VerifiedToken>;
  /** Throws ConflictError("EMAIL_EXISTS") or InvalidInputError for bad input. */
  createUser(input: { email: string; password: string; displayName: string }): Promise<{ uid: string }>;
  deleteUser(uid: string): Promise<void>;
  setClaims(uid: string, claims: Record<string, unknown>): Promise<void>;
}
export const IDENTITY_PROVIDER = Symbol("IDENTITY_PROVIDER");

/**
 * Legacy `users` collection (one document per account, any role). Replaced by
 * the `centers` / `responders` repositories in G2 (LLD section 2).
 */
export interface LegacyUserRecord {
  role?: string;
  statusRegistration?: string;
  centerID?: string;
  displayName?: string;
  email?: string;
  status?: string;
  disabled?: boolean;
}

export interface UserDirectory {
  get(uid: string): Promise<LegacyUserRecord | null>;
  create(uid: string, record: LegacyUserRecord): Promise<void>;
  /** Adds the device token to `fcmTokens`; repeating a token changes nothing. */
  addFcmToken(uid: string, token: string): Promise<void>;
}
export const USER_DIRECTORY = Symbol("USER_DIRECTORY");

export type TimerJobName = "expire-request" | "expand-radius" | "timeout-assignment";

/** A durable timer (ADR-0012). Survives API restarts, unlike setTimeout. */
export interface TimerJob {
  name: TimerJobName;
  /** Deterministic, e.g. `expire-<requestId>`, so a repeat is ignored. No ":" (BullMQ reserves it). */
  id: string;
  at: Date;
  payload: Record<string, string>;
}

export interface Scheduler {
  schedule(job: TimerJob): Promise<void>;
  cancel(id: string): Promise<void>;
  /** Throws when the queue backend cannot be reached. */
  ping(): Promise<void>;
  /** Registers the single handler for fired timers. */
  onTimer(handler: (job: Pick<TimerJob, "name" | "payload">) => Promise<void>): void;
}
export const SCHEDULER = Symbol("SCHEDULER");

export interface PushMessage {
  title: string;
  body: string;
  data: Record<string, string>;
}

export interface Notifier {
  /** Best effort: never throws, so a push failure cannot undo a committed command. */
  push(uids: string[], message: PushMessage): Promise<void>;
}
export const NOTIFIER = Symbol("NOTIFIER");

/** `requests/{id}` (LLD section 2.1). */
export interface RescueRequestRecord {
  id: string;
  requesterId: string;
  status: RequestStatus;
  location: RaiseSosBody["location"];
  category: IncidentCategory;
  severity: number;
  severitySource: "DEFAULT" | "REQUESTER" | "AI" | "DISPATCHER";
  description: string;
  searchRadiusKm: number;
  notifiedCenterIds: string[];
  claimedByCenterId: string | null;
  activeAssignmentId: string | null;
  responderId: string | null;
  participantIds: string[];
  idempotencyKey: string;
  endReason?: "COMPLETED" | "CANCELLED_BY_REQUESTER" | "NO_CENTER_AVAILABLE";
  createdAt: number;
  version: number;
}

export interface RequestRepository {
  newId(): string;
  findByIdempotencyKey(requesterId: string, key: string): Promise<RescueRequestRecord | null>;
  /** Throws ConflictError("ACTIVE_REQUEST_EXISTS") when the requester has an active request (INV-01). */
  create(record: RescueRequestRecord): Promise<void>;
  /** Transactional. `change` returns null to skip; ending a request frees the requester's lock. */
  update(
    id: string,
    change: (record: RescueRequestRecord) => RescueRequestRecord | null,
  ): Promise<RescueRequestRecord | null>;
}
export const REQUEST_REPOSITORY = Symbol("REQUEST_REPOSITORY");

export interface CenterDirectory {
  listApproved(): Promise<CenterCandidate[]>;
}
export const CENTER_DIRECTORY = Symbol("CENTER_DIRECTORY");
