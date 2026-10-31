# SOS API (NestJS)

Backend for SOS App. It replaces the Cloud Functions in `server/functions` ([ADR-0011](../../docs/04-adr/0011-nestjs-api-replaces-cloud-functions.md)) and keeps Firestore, Firebase Auth and FCM ([ADR-0013](../../docs/04-adr/0013-firestore-as-data-store.md)).

## Run locally

```bash
cd services/api
pnpm install
cp .env.example .env   # set FIREBASE_PROJECT_ID, and credentials or emulator hosts
pnpm test              # unit + e2e with fake Firebase adapters, no network
pnpm build && pnpm start
curl localhost:4000/health/live
```

## Layout

| Folder | Layer | Contents |
| --- | --- | --- |
| `src/application` | Application | Command handlers, ports (`IdentityProvider`, `UserDirectory`), errors with stable codes |
| `src/infrastructure/firebase` | Infrastructure | Firebase Admin adapters implementing the ports |
| `src/interface/http` | Interface | Controllers, global Firebase ID token guard, error filter, health |
| `test` | Tests | Supertest e2e against in-memory fakes |

The pure domain package (`packages/domain`) arrives in G2.

## Endpoints so far

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/health/live` | public | Liveness and keep-warm ping |
| POST | `/v1/responders` | approved center | CTR-02, replaces `POST /users/new-worker`. Body `{ displayName, email, password }`. Errors: 401, 403 `NOT_A_DISPATCHER` / `CENTER_NOT_APPROVED`, 400 validation, 409 `EMAIL_EXISTS` |

## Not ported yet

The Firestore triggers in `server/functions/index.js` (dispatch on new SOS, assignment handling, notifications) are still only in the legacy code. They are rewritten as command endpoints plus BullMQ jobs in G2, so the full SOS flow does not run against a new Firebase project until then.
