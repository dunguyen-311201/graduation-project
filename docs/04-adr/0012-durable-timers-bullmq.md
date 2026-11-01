# ADR-0012: Durable timers and background jobs with BullMQ

- **Status:** Accepted
- **Date:** 2026-10-31
- **Supersedes:** ADR-0005 (Cloud Tasks)
- **Related:** DSP-04, DSP-06, NF-03, ADR-0011

## Context

ADR-0005 chose Cloud Tasks because the timers (request expiry, assignment timeout, radius expansion) must survive the end of a function invocation. With the NestJS API (ADR-0011) there are no Cloud Functions, but the requirement is the same: a timer must fire even if the API process restarts or is redeployed between scheduling and firing. An in-process `setTimeout` would repeat the original bug.

## Decision

Use BullMQ on Redis for every timer and background job.

- Queue `rescue-timers` with delayed jobs: `expire-request` (+3 min), `expand-radius` (+60 s, +120 s), `timeout-assignment` (+60 s).
- Queue `domain-events` for outbox work that used to be Firestore triggers: notifications, center availability projection, SMS to relatives, AI triage.
- Job IDs are deterministic (`expire:{requestId}`, `timeout:{assignmentId}`) so a duplicate schedule is ignored and a claim can remove the pending expiry job.
- Handlers are idempotent: they reload the aggregate inside a transaction and do nothing if the state no longer matches (same rule as ADR-0005).
- Retries with exponential backoff (3 attempts); failed jobs stay in the failed set and raise an alert.
- Redis must be persistent (AOF on, `maxmemory-policy noeviction`) so scheduled jobs are not evicted.
- The `Scheduler` port is unchanged; only the adapter changes (`BullMqScheduler` instead of `CloudTasksScheduler`), so the use-case tests with `FakeScheduler` stay as they are.

## Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| BullMQ + Redis (chosen) | Mature, delayed jobs, dedup by job ID, retries, dashboard (Bull Board), first-class NestJS module | Needs a persistent Redis |
| `@nestjs/schedule` cron scanning `expiresAt` every 30 s | No Redis | Up to 30 s late; scans cost reads; several instances race unless locked |
| pg-boss (if PostgreSQL is chosen) | Jobs live in the same database, transactional enqueue | Only available with PostgreSQL; smaller ecosystem |
| Keep Cloud Tasks via HTTP target | Managed, accurate | Still a GCP dependency and Blaze plan; extra auth for the callback |

## Consequences

- Positive: DSP-04 and DSP-06 work across restarts; jobs are visible and retryable in Bull Board for demos.
- Negative: Redis becomes a critical dependency; free Redis tiers may evict or sleep, so production needs a persistent instance.
- Follow-up: keep the 5-minute safety-net sweep from ADR-0005 as a repeatable BullMQ job that finds `PENDING` requests older than 5 minutes.
