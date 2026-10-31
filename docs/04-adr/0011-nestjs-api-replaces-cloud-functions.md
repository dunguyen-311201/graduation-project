# ADR-0011: A NestJS API replaces Cloud Functions

- **Status:** Proposed
- **Date:** 2026-10-31
- **Supersedes:** the "Cloud Functions holds all business logic" part of ADR-0001; the Callable Function mechanism in ADR-0002
- **Related:** AUT-02, NF-01, NF-03, NF-10, ADR-0003, ADR-0012

## Context

The original Firebase project was deleted and a new one is being created. Deploying Cloud Functions now requires the Blaze (pay-as-you-go) plan. The owner also wants the backend to showcase a conventional, framework-based server (NestJS) consistent with their other projects, rather than a set of Firebase triggers.

The architectural intent of ADR-0002 and ADR-0003 does not change: clients send commands to a server that owns every business state change, and business rules live in a pure domain package. Only the runtime that hosts the application and interface layers changes.

## Decision

Build `services/api` as a NestJS (TypeScript) application and retire `server/functions`.

- **Interface layer:** REST controllers (`/v1/...`) replace Callable Functions, one endpoint per command from LLD §4 (for example `POST /v1/requests` for `raiseSos`, `POST /v1/requests/:id/claim`). Request bodies are validated with the zod schemas in `packages/contracts` through a `ZodValidationPipe`.
- **Authentication:** clients keep Firebase Auth (phone OTP, email). A global `FirebaseAuthGuard` verifies the ID token with the Firebase Admin SDK and builds the `Actor` (`uid`, `role`, `centerId` from custom claims, ADR-0004). A `@Roles()` decorator plus a `RolesGuard` enforce role checks.
- **Application layer:** command handlers from ADR-0003 are plain classes registered as Nest providers; ports are bound to adapters with Nest dependency injection tokens.
- **Side effects that used to be Firestore triggers** (outbox, projections, triage) run as BullMQ jobs enqueued by the command handler after commit, not as database triggers.
- **Timers** move from Cloud Tasks to BullMQ delayed jobs (ADR-0012).
- **Errors:** a global exception filter maps domain errors to HTTP 400/403/409 with a stable `code` field, the REST equivalent of `HttpsError.details.code`.
- **Hosting:** a Docker image deployed to Render (Singapore) with a Redis instance for BullMQ. Free-tier instances sleep after 15 minutes idle, which would break NF-01, so either a paid always-on instance is used for production or a keep-warm ping runs every 10 minutes (as in the Portfolio project).

The data store (keep Firestore, or move to PostgreSQL) is decided separately in ADR-0013.

## Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| NestJS API (chosen) | Conventional server, DI and modules map cleanly onto hexagonal layers, easy local run and debugging, no Blaze plan needed, same stack as the Portfolio project | Must run and pay for a server and Redis; cold start on free hosting; we lose Firestore triggers and Cloud Tasks for free |
| Keep Cloud Functions v2 | No server to run, scales to zero, native triggers | Requires Blaze; harder local debugging; less transferable as a showcase |
| Express without a framework | Minimal | We would rebuild DI, guards, pipes, filters by hand |

## Consequences

- Positive: one long-running process makes rate limiting, circuit breakers and in-memory caches straightforward; the API can be tested end to end with Supertest; the domain package is reused unchanged.
- Negative: the mobile app switches from `httpsCallable` to an HTTP client that attaches the ID token; we operate Redis; we need a health check and keep-warm strategy.
- Follow-up: ADR-0012 (timers), ADR-0013 (data store); update HLD §4 and LLD §1, §4, §5, §6; replace `server/functions` in the roadmap with `services/api`.
