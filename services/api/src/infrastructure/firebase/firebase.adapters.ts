import { ErrorCode } from "@sos/contracts";
import { type App, cert, getApps, initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import type { Env } from "../../config/env.js";
import { ConflictError, InvalidInputError } from "../../application/errors.js";
import type { IdentityProvider, LegacyUserRecord, UserDirectory, VerifiedToken } from "../../application/ports.js";

export function createFirebaseApp(env: Env): App {
  const existing = getApps()[0];
  if (existing) return existing;
  const raw = env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (raw) {
    const json = raw.startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
    const serviceAccount = JSON.parse(json) as { project_id?: string };
    return initializeApp({
      credential: cert(serviceAccount as Parameters<typeof cert>[0]),
      projectId: env.FIREBASE_PROJECT_ID ?? serviceAccount.project_id,
    });
  }
  return initializeApp({ credential: applicationDefault(), projectId: env.FIREBASE_PROJECT_ID });
}

const AUTH_INPUT_ERRORS = new Set(["auth/invalid-email", "auth/invalid-password", "auth/invalid-display-name"]);

export class FirebaseIdentityProvider implements IdentityProvider {
  constructor(private readonly app: App) {}

  async verifyIdToken(token: string): Promise<VerifiedToken> {
    const decoded = await getAuth(this.app).verifyIdToken(token);
    return { uid: decoded.uid, claims: decoded };
  }

  async createUser(input: { email: string; password: string; displayName: string }) {
    try {
      const user = await getAuth(this.app).createUser(input);
      return { uid: user.uid };
    } catch (error) {
      const code = (error as { code?: string }).code ?? "";
      if (code === "auth/email-already-exists") throw new ConflictError(ErrorCode.EMAIL_EXISTS, "Email is already registered");
      if (AUTH_INPUT_ERRORS.has(code)) throw new InvalidInputError(ErrorCode.INVALID_INPUT, (error as Error).message);
      throw error;
    }
  }

  async deleteUser(uid: string) {
    await getAuth(this.app).deleteUser(uid);
  }

  async setClaims(uid: string, claims: Record<string, unknown>) {
    await getAuth(this.app).setCustomUserClaims(uid, claims);
  }
}

export class FirestoreUserDirectory implements UserDirectory {
  constructor(private readonly app: App) {}

  async get(uid: string): Promise<LegacyUserRecord | null> {
    const snap = await getFirestore(this.app).doc(`users/${uid}`).get();
    return snap.exists ? (snap.data() as LegacyUserRecord) : null;
  }

  async create(uid: string, record: LegacyUserRecord) {
    // create() fails if the document exists, so an existing profile is never overwritten.
    await getFirestore(this.app).doc(`users/${uid}`).create(record);
  }

  async addFcmToken(uid: string, token: string) {
    await getFirestore(this.app)
      .doc(`users/${uid}`)
      .set({ fcmTokens: FieldValue.arrayUnion(token) }, { merge: true });
  }
}
