import { z } from "zod";

const csv = z
  .string()
  .default("")
  .transform((v) =>
    v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );

/** Every variable the API reads. See services/api/.env.example. */
export const envSchema = z.object({
  APP_ENV: z.enum(["dev", "stg", "prd", "test"]).default("dev"),
  PORT: z.coerce.number().int().positive().default(4000),
  /** Firebase project ID. Required unless the service account JSON carries it. */
  FIREBASE_PROJECT_ID: z.string().optional(),
  /**
   * Service account JSON (raw or base64) for the Admin SDK. Set it as a secret in
   * the hosting provider; never commit it. Unset = Application Default Credentials
   * (e.g. `gcloud auth application-default login` or the Auth/Firestore emulators).
   */
  FIREBASE_SERVICE_ACCOUNT_JSON: z.string().optional(),
  /** Allowed browser origins (the mobile app does not need CORS). */
  CORS_ORIGINS: csv,
});

export type Env = z.infer<typeof envSchema>;
export const ENV = Symbol("ENV");

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    throw new Error(`Invalid environment: ${z.prettifyError(parsed.error)}`);
  }
  return parsed.data;
}
