# SOS API (NestJS)

Backend for SOS App. It replaced the old Cloud Functions ([ADR-0011](../../docs/04-adr/0011-nestjs-api-replaces-cloud-functions.md)) and keeps Firestore, Firebase Auth and FCM ([ADR-0013](../../docs/04-adr/0013-firestore-as-data-store.md)).

## Run locally

From the repo root:

```bash
pnpm install
cp services/api/.env.example services/api/.env   # FIREBASE_PROJECT_ID, credentials or emulator hosts
pnpm test              # unit + e2e with fake Firebase adapters, no network
pnpm dev:api           # or: pnpm build && pnpm --filter @sos/api start
curl localhost:4000/health/live
```

Request schemas and error codes come from `@sos/contracts` (`packages/contracts`).

## Docker

The image is built from the repo root so it can include workspace packages:

```bash
docker build -f services/api/Dockerfile -t sos-api .
```

## Layout

| Folder | Layer | Contents |
| --- | --- | --- |
| `src/application` | Application | Command handlers, ports (`IdentityProvider`, `UserDirectory`), errors with stable codes |
| `src/infrastructure/firebase` | Infrastructure | Firebase Admin adapters implementing the ports |
| `src/interface/http` | Interface | Controllers, global Firebase ID token guard, error filter, health |
| `test` | Tests | Supertest e2e against in-memory fakes |

Business rules live in the pure domain package (`packages/domain`).

## Endpoints

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/health/live` | public | Liveness and keep-warm ping |
| GET | `/health/ready` | public | 503 when Redis is unreachable |
| PUT, DELETE | `/v1/me/fcm-token` | any user | Body `{ token }`. Register on sign-in, remove on sign-out |
| POST | `/v1/responders` | approved center | Body `{ displayName, email, password }` |
| POST | `/v1/responders/:id/disable`, `/enable` | center | Own responders only |
| PUT | `/v1/responders/me/availability` | responder | Body `{ availability: 'AVAILABLE' \| 'OFF_DUTY' }` |
| POST | `/v1/requests` | requester | Raise an SOS. Body per `raiseSosSchema` |
| POST | `/v1/requests/:id/cancel` | owner | |
| POST | `/v1/requests/:id/claim` | notified center | Repeating it is a no-op |
| POST | `/v1/requests/:id/assignments` | claiming center | Body `{ responderId }` |
| POST | `/v1/assignments/:id/accept`, `/reject` | assignee | |
| POST | `/v1/requests/:id/complete` | assignee | |

## Timers

BullMQ queue `rescue-timers`: `expire-request` (3 minutes), `timeout-assignment` (60 seconds) and a `sweep` every 5 minutes that recovers lost timers. The Redis in `render.yaml` is the free plan, which does not persist data, so production needs a persistent plan.
