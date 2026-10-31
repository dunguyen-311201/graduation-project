# ADR-0002: Every state change goes through a Callable Function

- **Status:** Proposed
- **Date:** 2026-10-31
- **Related:** AUT-02, NF-04, NF-05, INV-01..INV-07

## Context

Today the app writes `status`, `workerID`, `role` and `lastLogin` straight into Firestore, and Cloud Functions only react through triggers after the data has already changed. As a result, permissions cannot be checked (a user can mark their own rescue complete or promote their own role), invariants across documents are unprotected (two centers can assign the same request), and triggers re-trigger themselves.

## Decision

Clients only **read** business data and send **commands** via `httpsCallable`. Each command is a Callable Function that: checks auth + App Check, parses input with zod, checks role and ownership, and runs the use case inside one Firestore transaction. Firestore rules set `allow write: if false` for `requests`, `assignments` and `responders`. Triggers remain only for non-urgent side effects (outbox, projections, triage).

## Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| Callable commands (chosen) | Permissions and invariants checked in one place; transactions; errors returned synchronously to the UI | One extra round trip; cold starts |
| Client writes + complex rules | No functions, fast | Rules cannot express multi-document invariants; hard to test; logic scattered |
| Client writes + fix-up triggers | Same as today | Bad data exists for a while; cannot block unauthorized actions |

## Consequences

- Positive: one source of logic; use cases are easy to test; users see errors.
- Negative: `raiseSos` needs a min instance; commands lose Firestore offline writes (offset by a client-side queue, SOS-06).
- Follow-up: migrate every write in `hooks/` to `api.ts`; rules tests proving clients cannot write.
