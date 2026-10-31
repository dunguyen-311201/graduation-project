# ADR-0008: pnpm + Turborepo monorepo with shared contracts

- **Status:** Accepted (implemented 2026-10-31)
- **Date:** 2026-10-31
- **Related:** NF-10

## Context

The app (`sosapp/`) and Functions (`server/functions/`) define statuses and collection names twice (`constants/` and `constant.js`) and they have already drifted (`'free'` vs `USER_FREE`; `'reject'` has no constant). The two packages use different package managers (yarn and npm) and there is no single test command.

## Decision

Move to a pnpm workspaces + Turborepo monorepo:

- `apps/mobile` (Expo, ADR-0014), `services/api` (NestJS, ADR-0011), `packages/contracts`, and `packages/domain` (added in G2 with the first aggregate). The legacy `server/` folder (Firestore rules, indexes, old Functions) stays until G2 replaces the triggers.
- `pnpm-workspace.yaml` sets `nodeLinker: hoisted` because React Native autolinking and Metro expect a flat `node_modules`. Expo SDK 58's Metro config detects the workspace automatically, so no `watchFolders` setup is needed.
- `packages/contracts` is built with `tsc` to `dist/` (ESM + `.d.ts`); Turborepo runs `^build` before `typecheck`, `test` and `build` of its dependents.
- `packages/contracts`: zod schemas for every API request/response, enums (`RequestStatus`, `IncidentCategory`, `ErrorCode`), collection names. Both the app and the API import from it.
- Root commands today: `pnpm build`, `pnpm typecheck`, `pnpm test`, `pnpm dev:api`, `pnpm dev:mobile`, `pnpm android`. Planned: `pnpm lint`, `pnpm emulators`, `pnpm e2e`.

## Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| pnpm + Turborepo (chosen) | Build/test caching, same as the Portfolio project, easy code sharing | Needs a hoisted `node_modules` for React Native |
| Keep two folders, copy types | No restructuring | Type drift continues |
| Nx | Powerful | Heavier than needed |

## Consequences

- Positive: one source of truth for contracts; one CI command.
- Negative: the API Docker image is built from the repo root and uses `turbo prune @sos/api --docker` plus `pnpm deploy --legacy` to include internal packages.
- Follow-up: standardize on Node 22, TypeScript 5, ESLint flat config.
