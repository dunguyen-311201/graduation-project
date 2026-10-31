# SOS App

Rescue request app: people send an SOS with their location, the nearest rescue center dispatches a responder, and both sides follow the rescue in real time. Graduation project, being rebuilt with production practices (DDD, TDD, ADRs).

## Repository layout (pnpm + Turborepo)

| Path | What it is |
| --- | --- |
| [`apps/mobile`](apps/mobile) | Expo (React Native) app for users, responders and centers ([ADR-0014](docs/04-adr/0014-expo-dev-client.md)) |
| [`services/api`](services/api) | NestJS API, the only writer of business state ([ADR-0011](docs/04-adr/0011-nestjs-api-replaces-cloud-functions.md)) |
| [`packages/contracts`](packages/contracts) | Zod schemas, routes and error codes shared by the app and the API |
| [`server`](server) | Legacy Firebase config: Firestore rules and indexes, old Cloud Functions (retired in G2) |
| [`docs`](docs) | Plan, requirements, domain model, HLD, LLD, ADRs, test strategy |

The backend is a modular monolith, not microservices ([ADR-0015](docs/04-adr/0015-modular-monolith.md)).

## Getting started

Requirements: Node 22, pnpm 10 (`corepack enable`), Android Studio for the mobile app.

```bash
pnpm install          # installs every workspace
pnpm build            # builds packages/contracts and the API
pnpm test             # API tests
pnpm typecheck        # all workspaces
pnpm dev:api          # API on http://localhost:4000
pnpm android          # build and install the mobile dev client
pnpm dev:mobile       # Metro for the dev client
```

Each app has its own `.env.example`; see [`apps/mobile/README.md`](apps/mobile/README.md) and [`services/api/README.md`](services/api/README.md).

## Documentation

Start at [docs/README.md](docs/README.md). The roadmap is in [docs/01-plan/roadmap.md](docs/01-plan/roadmap.md).
