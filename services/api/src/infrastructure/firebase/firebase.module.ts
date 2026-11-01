import { Global, Module } from "@nestjs/common";
import { ENV, type Env } from "../../config/env.js";
import { IDENTITY_PROVIDER, NOTIFIER, USER_DIRECTORY } from "../../application/ports.js";
import { FcmNotifier } from "./fcm.notifier.js";
import { createFirebaseApp, FirebaseIdentityProvider, FirestoreUserDirectory } from "./firebase.adapters.js";

export const FIREBASE_APP = Symbol("FIREBASE_APP");

@Global()
@Module({
  providers: [
    { provide: FIREBASE_APP, inject: [ENV], useFactory: (env: Env) => createFirebaseApp(env) },
    { provide: IDENTITY_PROVIDER, inject: [FIREBASE_APP], useFactory: (app) => new FirebaseIdentityProvider(app) },
    { provide: USER_DIRECTORY, inject: [FIREBASE_APP], useFactory: (app) => new FirestoreUserDirectory(app) },
    { provide: NOTIFIER, inject: [FIREBASE_APP], useFactory: (app) => new FcmNotifier(app) },
  ],
  exports: [IDENTITY_PROVIDER, USER_DIRECTORY, NOTIFIER],
})
export class FirebaseModule {}
