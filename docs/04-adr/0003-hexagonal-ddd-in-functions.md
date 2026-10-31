# ADR-0003: Hexagonal architecture with a pure TypeScript domain

- **Status:** Proposed
- **Date:** 2026-10-31
- **Related:** NF-10, ADR-0010, ADR-0011 (hosts these layers in NestJS)

## Context

`server/functions/index.js` is a single 600-line file mixing Firestore queries, FCM sends, timers and business rules. It cannot be unit tested because every line calls real Firebase. We want TDD and tactical DDD (aggregates, value objects, invariants).

## Decision

Split into 4 layers, each its own folder/package, with dependencies pointing inward only:

1. `packages/domain`: aggregates, value objects, domain events, domain services. Standard TypeScript only; no Firebase imports, no I/O; time passed in through `Clock`.
2. `services/api/src/application`: command handlers (one use case per class) and port definitions (`RequestRepository`, `CenterDirectory`, `Notifier`, `Scheduler`, `TriageModel`, `Clock`, `UnitOfWork`).
3. `services/api/src/infrastructure`: adapters implementing the ports with Firestore, FCM, BullMQ, Claude.
4. `services/api/src/interface`: REST controllers, guards, BullMQ processors; they only parse input, build the actor, call a handler and map errors.

Enforced with `eslint-plugin-boundaries` in CI.

## Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| Hexagonal + pure domain (chosen) | Fast unit tests (ms), easy TDD, swappable infrastructure | More files, needs discipline |
| Service layer calling Firestore directly | Less code | Every test needs the emulator, slow |
| Keep one file, split into functions | Fastest | Does not solve testability or mixing of concerns |

## Consequences

- Positive: most tests run without the emulator; business logic reads like the spec.
- Negative: mappers between aggregates and Firestore documents; risk of over-engineering if use cases are not kept small.
- Follow-up: define `UnitOfWork` wrapping `runTransaction` so handlers never see Firestore.
