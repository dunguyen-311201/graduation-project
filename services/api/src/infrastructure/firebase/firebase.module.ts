import { Global, Module } from "@nestjs/common";
import { ENV, type Env } from "../../config/env.js";
import {
  CENTER_DIRECTORY,
  IDENTITY_PROVIDER,
  NOTIFIER,
  REQUEST_REPOSITORY,
  USER_DIRECTORY,
} from "../../application/ports.js";
import { FcmNotifier } from "./fcm.notifier.js";
import { FirestoreCenterDirectory, FirestoreRequestRepository } from "./firestore-requests.js";
import { createFirebaseApp, FirebaseIdentityProvider, FirestoreUserDirectory } from "./firebase.adapters.js";

export const FIREBASE_APP = Symbol("FIREBASE_APP");

@Global()
@Module({
  providers: [
    { provide: FIREBASE_APP, inject: [ENV], useFactory: (env: Env) => createFirebaseApp(env) },
    { provide: IDENTITY_PROVIDER, inject: [FIREBASE_APP], useFactory: (app) => new FirebaseIdentityProvider(app) },
    { provide: USER_DIRECTORY, inject: [FIREBASE_APP], useFactory: (app) => new FirestoreUserDirectory(app) },
    { provide: NOTIFIER, inject: [FIREBASE_APP], useFactory: (app) => new FcmNotifier(app) },
    { provide: REQUEST_REPOSITORY, inject: [FIREBASE_APP], useFactory: (app) => new FirestoreRequestRepository(app) },
    { provide: CENTER_DIRECTORY, inject: [FIREBASE_APP], useFactory: (app) => new FirestoreCenterDirectory(app) },
  ],
  exports: [IDENTITY_PROVIDER, USER_DIRECTORY, NOTIFIER, REQUEST_REPOSITORY, CENTER_DIRECTORY],
})
export class FirebaseModule {}
