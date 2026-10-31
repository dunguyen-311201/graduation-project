# ADR-0004: Authorization with Firebase Auth custom claims

- **Status:** Proposed
- **Date:** 2026-10-31
- **Related:** AUT-01, CTR-01, CTR-02

## Context

The role is currently a `role` field in `users/{uid}`, written by the client at sign-up (read from AsyncStorage). Anyone can set `role: 'center'` and `statusRegistration: 'approved'` on themselves.

## Decision

Store role and `centerId` in Firebase Auth custom claims, settable only by Cloud Functions (Admin SDK):

- New sign-up: blocking function `beforeUserCreated` sets `role: 'requester'`.
- `reviewCenter(APPROVE)`: sets `role: 'dispatcher'` and `centerId` on the registrant's account.
- `createResponder`: creates the user with `role: 'responder'` and `centerId`.
- Admin: set once manually with a script.

Rules and functions read `request.auth.token.role`. The client calls `getIdToken(true)` after a role change.

## Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| Custom claims (chosen) | No extra reads in rules; clients cannot modify | 1000-byte limit; token refresh needed after changes |
| `role` field + rules blocking writes | Simple | Rules need a `get()` per check, slower and costlier |
| Separate `roles/{uid}` collection | Flexible | Same as above |

## Consequences

- Positive: closes the self-promotion hole; short rules.
- Negative: one role per user at a time (enough for v1).
- Follow-up: migration script assigning claims to existing accounts from the current `role` field, after the admin confirms the list of legitimate centers.
