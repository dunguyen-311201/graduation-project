import { ConflictError } from "../src/application/errors.js";
import type { IdentityProvider, LegacyUserRecord, UserDirectory, VerifiedToken } from "../src/application/ports.js";

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
