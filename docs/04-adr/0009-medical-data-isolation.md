# ADR-0009: Isolate medical data and share it per rescue

- **Status:** Proposed
- **Date:** 2026-10-31
- **Related:** PRF-02, PRF-04, NF-06, NF-07, INV-08

## Context

The original requirements call for storing blood type, allergies and conditions to share with rescuers. This is sensitive personal data under Vietnam's Decree 13/2023/ND-CP, requiring explicit consent and restricted access.

## Decision

- Store it in `users/{uid}/private/medical`, separate from the profile; rules allow only the owner to read and write.
- Others read it only through the callable `getMedicalForRescue(requestId)`: the function checks the caller is in `participantIds`, the request is `CLAIMED`, `ASSIGNED` or `IN_PROGRESS`, and the owner has enabled `consents.medicalDataSharing`. Every read is audit-logged to the timeline.
- Never copy medical data into `requests` documents.
- Account deletion also deletes the private subcollection.

## Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| Private subcollection + per-rescue callable (chosen) | Time-bound access with an audit trail | One extra call when opening rescue details |
| Copy into the request at creation | Fast reads | Data lives forever in rescue history; hard to revoke |
| Cross-collection rules on `requests` | No function | Complex rules; no audit |

## Consequences

- Positive: follows data minimization; access is provable.
- Negative: needs consent UI and a data management screen.
- Follow-up: a privacy policy page (replacing the current `ConfirmPolicy` screen) describing what is shared, with whom and when.
