# Architecture Decision Records

Each ADR records one architectural decision: context, decision, options considered and consequences. Format follows Michael Nygard. An `Accepted` ADR is never edited; to change a decision, write a new ADR and mark the old one `Superseded by`.

| ADR | Title | Status |
| --- | --- | --- |
| [0001](0001-keep-firebase-serverless.md) | Keep Firebase as the backend platform | Partly superseded by 0011 |
| [0002](0002-server-authoritative-commands.md) | Every state change goes through a server command (transport per 0011) | Proposed |
| [0003](0003-hexagonal-ddd-in-functions.md) | Hexagonal architecture with a pure TypeScript domain | Proposed |
| [0004](0004-roles-via-custom-claims.md) | Authorization with Firebase Auth custom claims | Proposed |
| [0005](0005-durable-timers-cloud-tasks.md) | Durable timers with Cloud Tasks | Superseded by 0012 |
| [0006](0006-geohash-center-matching.md) | Geohash center matching with a stepped radius | Proposed |
| [0007](0007-ai-triage-advisory.md) | AI triage with Claude: async, advisory, escalate-only | Proposed |
| [0008](0008-monorepo-shared-contracts.md) | pnpm + Turborepo monorepo with shared contracts | Proposed |
| [0009](0009-medical-data-isolation.md) | Isolate medical data and share it per rescue | Proposed |
| [0010](0010-tdd-with-emulator.md) | TDD with a test pyramid and the Firebase Emulator | Proposed |
| [0011](0011-nestjs-api-replaces-cloud-functions.md) | A NestJS API replaces Cloud Functions | Proposed |
| [0012](0012-durable-timers-bullmq.md) | Durable timers and background jobs with BullMQ | Proposed |
| [0013](0013-firestore-as-data-store.md) | Keep Firestore as the data store behind the NestJS API | Proposed |

New ADR template: copy [template.md](template.md).
