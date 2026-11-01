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
