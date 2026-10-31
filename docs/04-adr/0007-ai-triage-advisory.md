# ADR-0007: AI triage with Claude: async, advisory, escalate-only

- **Status:** Proposed
- **Date:** 2026-10-31
- **Related:** TRI-01..TRI-05, NF-02, NF-07, DSP-07

## Context

We want AI to recognize the incident type and severity from the description and photos, so centers prioritize correctly and requesters get first-aid guidance while waiting. Risks: the AI is wrong (especially under-triaging severe cases), slow or failing, leaks personal data, or costs too much.

## Decision

1. Triage runs **asynchronously** after `RescueRequested` is recorded and centers are notified; it is never on the SOS critical path.
2. Results are **advisory**: labels and summary are shown to dispatchers, who can override them (TRI-05).
3. **Escalate-only**: `severity = max(current, AI)`; AI never lowers priority and never filters out requests.
4. Use the Claude API through the `ClaudeTriageModel` adapter (Anti-Corruption Layer), with output forced through a tool schema and validated with zod. `claude-haiku-5-5` for text, `claude-sonnet-5-5` when photos are attached.
5. Never send name, phone number or national ID; photos and medical data only with consent.
6. 8-second timeout, one retry, circuit breaker; every failure is only logged.

## Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| LLM via API, async, escalate-only (chosen) | Understands free-form Vietnamese and photos, no training data needed, safe under failure | Per-call cost; provider dependency |
| Keyword / rule classifier | Cheap, explainable | Poor on free text; no image understanding |
| Train our own model | Control | No data; time-consuming; out of scope |
| Synchronous AI before dispatch | Dispatch has the info immediately | Adds seconds to SOS; AI failure breaks SOS |

## Consequences

- Positive: a technical highlight for the portfolio; better dispatch quality without added risk.
- Negative: needs an eval set and quality monitoring; needs consent UI.
- Follow-up: write prompt v1 and an eval set of 50 to 100 cases; under-triage = 0 is the condition for enabling it in prod (feature flag `aiTriageEnabled`).
