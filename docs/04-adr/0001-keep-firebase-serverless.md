# ADR-0001: Keep Firebase as the backend platform

- **Status:** Proposed
- **Date:** 2026-10-31
- **Related:** NF-01, NF-08, NF-12

## Context

The project currently uses Firebase (Auth, Firestore, Functions, FCM). During the refactor we could move to a custom backend (NestJS + PostgreSQL + Redis, as in the Portfolio project) for SQL transactions and full control. Constraints: a single developer, a near-zero budget, and an app that needs realtime updates (status, location) and push notifications.

## Decision

Keep Firebase. Firestore is the source of truth, Cloud Functions v2 (TypeScript) holds all business logic, Cloud Tasks handles timers. The domain is written independently of Firebase (ADR-0003) so the infrastructure can change later without rewriting business rules.

## Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| Firebase (chosen) | Built-in realtime listeners, phone OTP auth, FCM, generous free tier, no servers to run | Limited queries (geo needs geohash), 500-write transaction limit, vendor lock-in |
| NestJS + PostgreSQL/PostGIS + WebSocket | Strong transactions and geo queries; familiar from Portfolio | Must build realtime, OTP auth and push; always-on server cost; large rewrite |
| Supabase | Postgres + realtime + auth | Full app rewrite; push still needs FCM |

## Consequences

- Positive: most mobile code is kept; demo cost near zero; focus stays on business logic.
- Negative: we must build geohash matching (ADR-0006) and trigger idempotency ourselves; tests need the Emulator.
- Follow-up: create `dev/staging/prod` projects; region `asia-southeast1`.
