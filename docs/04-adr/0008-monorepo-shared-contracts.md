# ADR-0008: pnpm + Turborepo monorepo with shared contracts

- **Status:** Proposed
- **Date:** 2026-10-31
- **Related:** NF-10

## Context

The app (`sosapp/`) and Functions (`server/functions/`) define statuses and collection names twice (`constants/` and `constant.js`) and they have already drifted (`'free'` vs `USER_FREE`; `'reject'` has no constant). The two packages use different package managers (yarn and npm) and there is no single test command.

## Decision

Move to a pnpm workspaces + Turborepo monorepo:

- `apps/mobile`, `services/api`, `packages/domain`, `packages/contracts`, `firebase/`.
- `packages/contracts`: zod schemas for every API request/response, enums (`RequestStatus`, `IncidentCategory`, `ErrorCode`), collection names. Both the app and the API import from it.
- Root commands: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm emulators`, `pnpm e2e`.

## Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| pnpm + Turborepo (chosen) | Build/test caching, same as the Portfolio project, easy code sharing | Metro (React Native) needs `watchFolders` and symlink config |
| Keep two folders, copy types | No restructuring | Type drift continues |
| Nx | Powerful | Heavier than needed |

## Consequences

- Positive: one source of truth for contracts; one CI command.
- Negative: Metro monorepo config; the API Docker image must include internal packages (`pnpm deploy --filter api`).
- Follow-up: standardize on Node 22, TypeScript 5, ESLint flat config.
