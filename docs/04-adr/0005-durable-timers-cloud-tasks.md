# ADR-0005: Durable timers with Cloud Tasks

- **Status:** Superseded by [ADR-0012](0012-durable-timers-bullmq.md)
- **Date:** 2026-10-31
- **Related:** DSP-04, DSP-06, NF-03

## Context

Trigger `newRequest` uses a 10-minute `setTimeout` and `serviceAssign` a 1-minute `setTimeout`. Cloud Functions may reclaim the instance as soon as the function returns, and the default timeout is 60 seconds, so these timers almost never fire. Consequences: requests never expire, requesters stay stuck as busy, unanswered assignments are never reclaimed.

## Decision

Use Cloud Tasks via firebase-functions v2 `onTaskDispatched`. Each timer is a task with a deterministic name (`expire-{requestId}`, `expand-{requestId}-{n}`, `timeout-{assignmentId}`) and a `scheduleTime`. Handlers are idempotent: they read current state in a transaction and skip if it no longer applies. A successful claim cancels the `expire-*` task (best effort; the handler still checks).

## Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| Cloud Tasks (chosen) | Fires on time (seconds), retries, name-based dedup, cancellable | Another GCP service; IAM setup |
| Scheduled function every minute scanning `expiresAt` | Simple, no cancellation | Up to 60 s late; scans cost reads |
| `setTimeout` (today) | None | Does not fire |

## Consequences

- Positive: DSP-04 and DSP-06 work; easy to test with `FakeScheduler` + `FakeClock`.
- Negative: the Emulator does not fully emulate Cloud Tasks; integration tests call handlers directly.
- Follow-up: add a "safety net" scheduled function every 5 minutes that finds `PENDING` requests older than 5 minutes to catch lost tasks.
