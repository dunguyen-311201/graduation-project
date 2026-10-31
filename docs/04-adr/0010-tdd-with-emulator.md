# ADR-0010: TDD with a test pyramid and the Firebase Emulator

- **Status:** Proposed
- **Date:** 2026-10-31
- **Related:** NF-10, ADR-0003, [test-strategy](../05-testing/test-strategy.md)

## Context

The project has no meaningful tests. Several current bugs (undefined variable `docCenter`, a query on the wrong field `userID`, `.docs.at(0).id` on an empty result) would have been caught by a trivial test. The system is stateful with contention, the kind most likely to break without tests.

## Decision

- Write business code with TDD: failing test first (Red), minimal code (Green), clean up (Refactor). Seed test cases come from acceptance criteria and invariants.
- Test pyramid: domain unit tests (Vitest, fast, most numerous) → use cases with fake adapters → integration with the Firebase Emulator (repositories, rules, triggers) → Maestro E2E (few, main flows).
- Firestore and Storage rules have dedicated tests with `@firebase/rules-unit-testing`; no rules change merges without tests.
- CI blocks merges on: lint, typecheck, tests, domain coverage < 90%, or gitleaks findings.

## Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| TDD + pyramid + emulator (chosen) | Better design, early bug detection, fast tests | Slower at the start |
| Tests after code | Familiar | Easily skipped; tests mirror the implementation |
| Mostly E2E | Realistic | Slow, flaky, hard to pinpoint causes |

## Consequences

- Positive: safe refactoring during the React Native and Functions upgrades; tests act as living documentation.
- Negative: the Emulator needs Java in CI; longer CI (target < 8 minutes).
- Follow-up: build `FakeClock`, `FakeScheduler`, `InMemoryRequestRepository`, `RecordingNotifier` in `services/functions/test/fakes`.
