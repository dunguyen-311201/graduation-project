# ADR-0013: Keep Firestore as the data store behind the NestJS API

- **Status:** Proposed
- **Date:** 2026-10-31
- **Related:** ADR-0001, ADR-0011, ADR-0012, NF-01, NF-04

## Context

ADR-0011 moved business logic from Cloud Functions to a NestJS API. That opened the question of whether to also move data from Firestore to PostgreSQL (with PostGIS, Redis and Socket.IO, as in the Portfolio project). The mobile app currently reads every screen through Firestore realtime listeners.

## Decision

Keep Cloud Firestore as the system of record. The NestJS API reads and writes it with the Firebase Admin SDK; the mobile app keeps **reading** through Firestore listeners under security rules and **writes** only through the API.

- Repositories in `services/api/src/infrastructure/firestore` implement the domain ports; multi-document invariants use `runTransaction` with the aggregate `version` field (unchanged from the LLD).
- Firestore rules deny all client writes to business collections; the Admin SDK bypasses rules, so the API is the only writer.
- Firebase Auth and FCM stay. The Firebase project can run on the free Spark plan because no Cloud Functions are deployed.
- Geo matching keeps geohash (ADR-0006).
- The domain package stays storage-agnostic, so a later move to PostgreSQL only replaces repository adapters.

## Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| Firestore (chosen) | Realtime reads already work in the app; no database to host; free tier; minimal mobile rework | Weaker queries (geohash), 500-write transaction limit, Admin SDK credentials must be given to the API host |
| PostgreSQL + PostGIS + Socket.IO | Strong SQL transactions and geo queries; same stack as Portfolio | Rewrite every read path in the app; host and pay for Postgres and a WebSocket layer; longer timeline |

## Consequences

- Positive: the mobile change is limited to sending commands over HTTP; realtime UX is preserved.
- Negative: the API host needs a service account credential, supplied as the secret `FIREBASE_SERVICE_ACCOUNT_JSON` (never committed); Firestore emulator is still needed for integration tests.
- Follow-up: create the service account key only in the new project, store it in the hosting provider's secret store, rotate it if leaked.
