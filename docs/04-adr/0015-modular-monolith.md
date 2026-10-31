# ADR-0015: Modular monolith, not microservices

- **Status:** Proposed
- **Date:** 2026-10-31
- **Related:** ADR-0003, ADR-0008, ADR-0011, ADR-0012, NF-01, NF-10

## Context

With the move to a Turborepo monorepo (ADR-0008) and a NestJS backend (ADR-0011), the question came up whether each bounded context (Emergency Request, Dispatch, Triage, Center Management, Profile & Medical, Notification, IAM) should become its own deployable microservice.

Constraints: one developer, a graduation-project timeline, low traffic (a few hundred requests per hour at most), free or very cheap hosting (Render free tier, one Redis), and one data store (Firestore, ADR-0013). Dispatch needs consistent reads and writes across RescueRequest, Assignment and Responder (INV-01..08).

## Decision

Build the backend as a **modular monolith**: one codebase (`services/api`), one Docker image, two process types.

- Each bounded context is a Nest module under `services/api/src/modules/<context>/` with its own `domain`, `application`, `infrastructure` and `interface` folders (hexagonal, ADR-0003).
- Modules talk to each other only through application services exported by the module or through domain events on the `domain-events` BullMQ queue (ADR-0012). No module reads another module's Firestore collections directly.
- Shared vocabulary lives in `packages/contracts` (API schemas, error codes) and, from G2, `packages/domain` (aggregates and invariants).
- The same image runs as the **API** process (HTTP) and as a **worker** process (BullMQ timers and outbox jobs), selected by an environment variable, so background load never blocks HTTP.
- An architecture test (dependency-cruiser or ESLint boundaries) fails CI when a module imports another module's internals.

## Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| Modular monolith (chosen) | One deploy and one set of secrets; in-process transactions for dispatch invariants; cheap to host; module boundaries keep a later split possible | Modules scale together; discipline needed to keep boundaries |
| Microservices per bounded context | Independent deploy and scaling; technology freedom per service | Network calls and partial failures between Dispatch and Requests; distributed transactions or sagas for INV-01..08; 5+ services to host, monitor and secure; far beyond the team size and traffic |
| Unstructured monolith | Fastest to start | Contexts couple quickly; no path to split |

## Consequences

- Positive: one `pnpm test` and one Docker image; dispatch invariants stay in Firestore transactions; the free hosting budget is enough.
- Negative: one deployable means one blast radius; a bug in Triage can crash the API process (mitigated by running Triage jobs in the worker process).
- Follow-up: a module can be extracted into its own service when it has a clear reason (for example AI triage needing separate scaling or a GPU). Its BullMQ queue becomes the integration point, so callers do not change.
