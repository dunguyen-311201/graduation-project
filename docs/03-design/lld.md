# Low-Level Design (LLD)

Version 1.0 · 2026-10-31 · Status: Proposed

## 1. Source layout (monorepo)

```text
graduation-project/
├─ apps/
│  └─ mobile/                      # React Native app
│     └─ src/
│        ├─ app/                   # navigation, providers, theme
│        ├─ features/
│        │  ├─ sos/                # SOS button, countdown, tracking screen
│        │  ├─ dispatch/           # request list, claim, assign (dispatcher)
│        │  ├─ mission/            # accept work, map, complete (responder)
│        │  ├─ profile/            # profile, medical, emergency contacts
│        │  ├─ notifications/
│        │  └─ auth/
│        │     └─ (each feature: screens/, components/, hooks/, api.ts, __tests__/)
│        └─ shared/                # UI kit, lib (firebase, location), utils
├─ services/
│  └─ api/                         # NestJS API (ADR-0011)
│     ├─ src/
│     │  ├─ application/           # command handlers + ports
│     │  ├─ infrastructure/        # firestore repos, fcm, sms, bullmq, claude
│     │  ├─ interface/http/        # controllers, guards, pipes, filters
│     │  ├─ interface/jobs/        # BullMQ processors (timers, outbox)
│     │  ├─ app.module.ts
│     │  └─ main.ts                # starts HTTP and/or workers by MODE
│     ├─ test/                     # e2e (Supertest) + fakes
│     └─ Dockerfile
├─ packages/
│  ├─ domain/                      # aggregates, VOs, events, policies (pure TS)
│  └─ contracts/                   # zod schemas for API request/response, shared enums
├─ firebase/
│  ├─ firestore.rules
│  ├─ firestore.indexes.json
│  ├─ storage.rules
│  └─ tests/                       # rules unit tests
├─ e2e/                            # Maestro flows
├─ docs/
└─ .github/workflows/
```

Tooling: pnpm workspaces + Turborepo, TypeScript 5 strict, NestJS 11, Jest + Supertest for the API, Vitest for pure packages, Jest + React Native Testing Library for mobile, ESLint (`eslint-plugin-boundaries`), Prettier, Husky + lint-staged.

## 2. Firestore schema

All instants are stored as `Timestamp`. Every aggregate document has `version: number` and `updatedAt`.

### 2.1 `requests/{requestId}`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `requesterId` | string | ✓ | uid |
| `status` | `'PENDING' \| 'CLAIMED' \| 'ASSIGNED' \| 'IN_PROGRESS' \| 'COMPLETED' \| 'CANCELLED' \| 'EXPIRED'` | ✓ | |
| `location` | `{ lat, lng, accuracyM, capturedAt, geohash, address? }` | ✓ | |
| `category` | `IncidentCategory` | ✓ | default `OTHER` |
| `severity` | 1..5 | ✓ | default 3 |
| `severitySource` | `'DEFAULT' \| 'REQUESTER' \| 'AI' \| 'DISPATCHER'` | ✓ | |
| `description` | string ≤ 1000 | | |
| `attachments` | `{ path, contentType }[]` ≤ 3 | | Storage paths |
| `searchRadiusKm` | 10 \| 20 \| 50 | ✓ | |
| `notifiedCenterIds` | string[] ≤ 15 | ✓ | used by read rules |
| `claimedByCenterId` | string \| null | ✓ | |
| `activeAssignmentId` | string \| null | ✓ | |
| `responderId` | string \| null | ✓ | current responder, used by read rules |
| `triage` | `{ category, severity, confidence, summary, firstAid[], needs[], model, promptVersion }` \| null | | |
| `participantIds` | string[] | ✓ | requester + claiming center's dispatchers + responder, for rules |
| `createdAt`, `claimedAt`, `startedAt`, `endedAt` | Timestamp | | |
| `endReason` | `'COMPLETED' \| 'CANCELLED_BY_REQUESTER' \| 'NO_CENTER_AVAILABLE'` | | |
| `idempotencyKey` | string | ✓ | client-generated (UUID v4) |
| `version` | number | ✓ | |

Subcollection `requests/{id}/timeline/{eventId}`: `{ type, actorId, actorRole, from, to, at, data }`.

### 2.2 Other collections

| Collection | Main fields |
| --- | --- |
| `assignments/{id}` | `requestId`, `centerId`, `responderId`, `status` (`OFFERED`/`ACCEPTED`/`REJECTED`/`TIMED_OUT`/`COMPLETED`/`CANCELLED`), `offeredAt`, `respondedAt`, `rejectReason?`, `version` |
| `centers/{id}` | `name`, `address`, `location{lat,lng}`, `geohash`, `registrationStatus`, `availableResponders`, `dispatcherIds[]`, `phone`, `licenseNo`, `version` |
| `responders/{uid}` | `centerId`, `displayName`, `availability`, `currentAssignmentId`, `disabled`, `stats{missions,totalDistanceM,totalDurationS}`, `version` |
| `users/{uid}` | `displayName`, `phone`, `photoURL`, `fcmTokens[]`, `consents{medicalDataSharing,aiProcessing,photoSharing}`, `emergencyContacts[{name,phone,relationship}]` ≤ 5, `createdAt` |
| `users/{uid}/private/medical` | `bloodType` (`A+`…`O-`, `UNKNOWN`), `allergies[]`, `conditions[]`, `medications[]`, `notes`, `updatedAt` |
| `tracking/{requestId}` | `requester{lat,lng,accuracyM,at}`, `responder{lat,lng,accuracyM,heading,at}` |
| `notifications/{id}` | `recipientId`, `type`, `title`, `body`, `data{requestId,assignmentId?}`, `createdAt`, `readAt`; ID = `hash(eventId + recipientId)` for deduplication (NTF-03) |
| `activeRequests/{requesterId}` | `requestId`, `createdAt` (deleted when the request ends) |
| `processedEvents/{eventId}` | `handler`, `at`, TTL 7 days |
| `triageOverrides/{requestId}` | `byDispatcherId`, `category`, `severity`, `at` (TRI-05) |

### 2.3 Indexes

| Collection | Fields | Used for |
| --- | --- | --- |
| `centers` | `registrationStatus ASC, geohash ASC` | Geo query (DSP-01) |
| `requests` | `requesterId ASC, createdAt DESC` | Requester history |
| `requests` | `claimedByCenterId ASC, status ASC, createdAt DESC` | Center's request list |
| `requests` | `notifiedCenterIds ARRAY_CONTAINS, status ASC, createdAt DESC` | Requests awaiting claim for a center |
| `assignments` | `responderId ASC, status ASC` | Current assignment |
| `responders` | `centerId ASC, availability ASC` | Available responders |

## 3. `RescueRequest` state machine

```mermaid
stateDiagram-v2
  [*] --> PENDING: RaiseSos
  PENDING --> PENDING: ExpandRadius / TriageCompleted
  PENDING --> CLAIMED: ClaimRequest (dispatcher)
  PENDING --> EXPIRED: ExpireRequest (3-minute timer)
  PENDING --> CANCELLED: CancelSos (requester)
  CLAIMED --> ASSIGNED: AssignResponder
  CLAIMED --> CANCELLED: CancelSos
  ASSIGNED --> IN_PROGRESS: AcceptAssignment (responder)
  ASSIGNED --> CLAIMED: RejectAssignment / TimeoutAssignment (60 s)
  ASSIGNED --> CANCELLED: CancelSos
  IN_PROGRESS --> COMPLETED: CompleteRescue (responder)
  COMPLETED --> [*]
  CANCELLED --> [*]
  EXPIRED --> [*]
```

The transition table is a static map in `packages/domain/src/rescue-request/transitions.ts`; `RescueRequest.transition(to, actor)` throws `InvalidTransitionError` when the edge does not exist (INV-05). One test walks the full 7 × 7 matrix to prove every invalid edge is rejected.

`Assignment`: `OFFERED → ACCEPTED → COMPLETED`; `OFFERED → REJECTED | TIMED_OUT | CANCELLED`; `ACCEPTED → CANCELLED` (only if the request is cancelled before start; not allowed in v1).

`Responder.availability`: `OFF_DUTY ⇄ AVAILABLE`, `AVAILABLE → ON_MISSION` (reserve), `ON_MISSION → AVAILABLE` (release). `OFF_DUTY` is not allowed while `ON_MISSION`.

## 4. API contracts (REST, NestJS)

Base URL `${API_URL}/v1`. Every endpoint requires `Authorization: Bearer <Firebase ID token>` (verified by `FirebaseAuthGuard`), optionally `X-Firebase-AppCheck`. Bodies are validated with zod schemas from `packages/contracts`. Errors use one shape:

```json
{ "statusCode": 409, "code": "ALREADY_CLAIMED", "message": "Request already claimed by another center" }
```

Status mapping: validation → 400, missing/invalid token → 401, wrong role or not owner → 403, unknown resource → 404, business rule / invalid transition → 409, rate limit → 429.

The "Command" column keeps the command names used in the domain and test cases.

| Command | Endpoint | Role | Input | Output | Business errors |
| --- | --- | --- | --- | --- | --- |
| `raiseSos` | `POST /requests` | requester | `{ idempotencyKey, location{lat,lng,accuracyM,capturedAt}, category?, severity?, description? }` | `{ requestId, status }` | `ACTIVE_REQUEST_EXISTS`, `STALE_LOCATION`, `RATE_LIMITED` |
| `updateSosDetails` | `PATCH /requests/:id` | requester (owner) | `{ requestId, category?, description?, attachments? }` | `{ ok }` | `NOT_OWNER`, `REQUEST_CLOSED` |
| `cancelSos` | `POST /requests/:id/cancel` | requester (owner) | `{ requestId, reason? }` | `{ status }` | `NOT_OWNER`, `INVALID_TRANSITION` |
| `claimRequest` | `POST /requests/:id/claim` | dispatcher | `{ requestId }` | `{ status }` | `NOT_NOTIFIED`, `ALREADY_CLAIMED`, `INVALID_TRANSITION` |
| `assignResponder` | `POST /requests/:id/assignments` | dispatcher (claiming center) | `{ requestId, responderId }` | `{ assignmentId }` | `NOT_CLAIM_OWNER`, `RESPONDER_UNAVAILABLE`, `RESPONDER_NOT_IN_CENTER`, `ASSIGNMENT_ACTIVE` |
| `acceptAssignment` | `POST /assignments/:id/accept` | responder (assignee) | `{ assignmentId, location }` | `{ requestId, status }` | `NOT_ASSIGNEE`, `ASSIGNMENT_CLOSED` |
| `rejectAssignment` | `POST /assignments/:id/reject` | responder (assignee) | `{ assignmentId, reason? }` | `{ ok }` | `NOT_ASSIGNEE`, `ASSIGNMENT_CLOSED` |
| `completeRescue` | `POST /requests/:id/complete` | responder (assignee) | `{ requestId, distanceM, note? }` | `{ status }` | `NOT_ASSIGNEE`, `INVALID_TRANSITION` |
| `setAvailability` | `PUT /responders/me/availability` | responder | `{ availability: 'AVAILABLE' \| 'OFF_DUTY' }` | `{ availability }` | `ON_MISSION`, `DISABLED` |
| `createResponder` | `POST /responders` | dispatcher | `{ displayName, email, tempPassword }` | `{ responderId }` | `EMAIL_EXISTS` |
| `disableResponder` | `POST /responders/:id/disable` | dispatcher | `{ responderId }` | `{ ok }` | `RESPONDER_NOT_IN_CENTER`, `ON_MISSION` |
| `registerCenter` | `POST /centers` | signed-in user | `{ name, address, location, phone, licenseNo }` | `{ centerId }` | `ALREADY_REGISTERED` |
| `reviewCenter` | `POST /centers/:id/review` | admin | `{ centerId, decision: 'APPROVE' \| 'REJECT', note? }` | `{ status }` | `INVALID_TRANSITION` |
| `overrideTriage` | `PUT /requests/:id/triage` | dispatcher (claiming center) | `{ requestId, category, severity }` | `{ ok }` | `NOT_CLAIM_OWNER` |
| `getMedicalForRescue` | `GET /requests/:id/medical` | dispatcher/responder on the rescue | `{ requestId }` | `MedicalProfile \| null` | `NOT_PARTICIPANT`, `NO_CONSENT` |
| `registerFcmToken` | `PUT /me/fcm-token` | any user | `{ token }` | `{ ok }` | |

Example contract:

```ts
// packages/contracts/src/raise-sos.ts
export const RaiseSosInput = z.object({
  idempotencyKey: z.string().uuid(),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    accuracyM: z.number().nonnegative().max(5000),
    capturedAt: z.number().int(), // epoch ms
  }),
  category: IncidentCategory.optional(),
  severity: z.number().int().min(1).max(5).optional(),
  description: z.string().max(1000).optional(),
});
export type RaiseSosInput = z.infer<typeof RaiseSosInput>;
export const RaiseSosOutput = z.object({ requestId: z.string(), status: RequestStatus });
```

**Idempotency:** `POST /requests` takes an `Idempotency-Key` header (stored as `idempotencyKey`) and looks up `requests` by key + `requesterId`; a repeated call with the same key returns the existing request instead of creating a new one. Other commands are naturally idempotent through the state machine (a repeated `claimRequest` by the same center succeeds).

## 5. Detailed sequences

### 5.1 `raiseSos`

```mermaid
sequenceDiagram
  autonumber
  participant C as RequestsController (POST /v1/requests)
  participant H as RaiseSosHandler
  participant RL as RateLimiter
  participant Repo as RequestRepository
  participant Dir as CenterDirectory
  participant P as CenterMatchingPolicy
  participant S as Scheduler (BullMQ)
  participant N as Notifier

  C->>C: FirebaseAuthGuard, RolesGuard(requester), ZodValidationPipe
  C->>H: execute(cmd, actor)
  H->>RL: check(actor.uid)
  H->>Repo: findByIdempotencyKey(uid, key)
  alt already exists
    H-->>C: existing requestId
  end
  H->>H: GeoPoint.isFresh(now, 2 min) else STALE_LOCATION
  H->>Dir: nearbyApproved(location, 10 km)
  H->>P: select(candidates, limit 5)
  H->>Repo: runInTransaction: lock activeRequests/{uid} (INV-01), save RescueRequest.raise(...)
  H->>S: schedule ExpireRequest(+3m), ExpandRadius(+60s)
  H->>N: notifyCenters(candidates, priority by severity)
  H-->>C: { requestId, PENDING }
```

If no center exists within 10 km, the handler expands to 20 and then 50 km before returning. If there is still none, the request is still created as `PENDING` so the `ExpireRequest` timer handles it, and the requester sees emergency numbers immediately.

### 5.2 Assignment rejection / timeout

```mermaid
sequenceDiagram
  autonumber
  actor S as Responder
  participant Fn as POST /assignments/:id/reject or timeout job
  participant DB as Firestore (transaction)
  participant N as Notifier
  actor D as Dispatcher

  alt Responder rejects
    S->>Fn: rejectAssignment(assignmentId)
  else 60 seconds pass
    Note over Fn: BullMQ runs timeout-assignment job
  end
  Fn->>DB: read assignment, request, responder
  alt assignment no longer OFFERED
    Fn-->>Fn: skip (idempotent)
  else
    Fn->>DB: assignment → REJECTED/TIMED_OUT
    Fn->>DB: request ASSIGNED → CLAIMED, activeAssignmentId = null
    Fn->>DB: responder → AVAILABLE (rejected) or OFF_DUTY (timed out)
  end
  Fn->>N: tell dispatcher "reassignment needed"
  N-->>D: push
```

### 5.3 Projections and side effects through jobs (outbox)

A command handler writes the aggregate plus a `timeline` record in one transaction, then enqueues one `domain-events` job per new event (job id = `eventId`). If the process dies between commit and enqueue, the 5-minute sweep re-enqueues timeline entries without a matching `processedEvents` document, so no event is lost. Processors check `processedEvents/{eventId}` before running secondary policies (non-urgent notifications, updating `centers.availableResponders`, SMS to relatives, starting triage). The urgent push (notifying centers of a new SOS) is sent directly in the raise-SOS handler to meet NF-01.

## 6. Timers (BullMQ)

Per [ADR-0012](../04-adr/0012-durable-timers-bullmq.md), queue `rescue-timers` on Redis.

| Job | Delay | Handler does | Skip when |
| --- | --- | --- | --- |
| `expand-radius` | 60 s and 120 s after creation | `request.expandRadius()`, notify new centers | status ≠ `PENDING` or already at 50 km |
| `expire-request` | 3 min after creation | `request.expire()`, delete `activeRequests`, push the requester | status ≠ `PENDING` |
| `timeout-assignment` | 60 s after assignment | as in §5.2 | assignment ≠ `OFFERED` |
| `sweep` (repeatable) | every 5 min | re-enqueue lost timers and outbox events | nothing to do |

Job ids are deterministic (`expire:{requestId}`, `timeout:{assignmentId}`) so duplicates are ignored and a claim can remove the pending expiry job. The `Scheduler` port has `schedule(name, at, payload)` and `cancel(name)`; the test fake records the schedule and lets tests "fast-forward" with `FakeClock`.

## 7. Firestore security rules

Principles: deny by default; clients write only what belongs to them and never business state.

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    function signedIn() { return request.auth != null; }
    function role() { return request.auth.token.role; }
    function uid() { return request.auth.uid; }
    function onlyChanges(keys) {
      return request.resource.data.diff(resource.data).affectedKeys().hasOnly(keys);
    }

    match /users/{userId} {
      allow read: if signedIn() && uid() == userId;
      allow create: if signedIn() && uid() == userId
        && !request.resource.data.keys().hasAny(['role', 'fcmTokens']);
      allow update: if signedIn() && uid() == userId
        && onlyChanges(['displayName', 'photoURL', 'consents', 'emergencyContacts'])
        && request.resource.data.emergencyContacts.size() <= 5;

      match /private/medical {
        allow read, write: if signedIn() && uid() == userId;
      }
    }

    match /requests/{requestId} {
      allow read: if signedIn() && (
        uid() in resource.data.participantIds ||
        (role() == 'dispatcher' && request.auth.token.centerId in resource.data.notifiedCenterIds)
      );
      allow write: if false; // NestJS API only (Admin SDK bypasses rules)

      match /timeline/{eventId} {
        allow read: if signedIn() && uid() in get(/databases/$(db)/documents/requests/$(requestId)).data.participantIds;
        allow write: if false;
      }
    }

    match /tracking/{requestId} {
      function req() { return get(/databases/$(db)/documents/requests/$(requestId)).data; }
      allow read: if signedIn() && uid() in req().participantIds;
      allow update: if signedIn() && req().status in ['ASSIGNED', 'IN_PROGRESS'] && (
        (uid() == req().requesterId && onlyChanges(['requester'])) ||
        (uid() == req().responderId && onlyChanges(['responder']))
      );
    }

    match /centers/{centerId} {
      allow read: if signedIn();
      allow update: if role() == 'dispatcher' && request.auth.token.centerId == centerId
        && onlyChanges(['name', 'address', 'phone']);
    }

    match /responders/{responderId} {
      allow read: if signedIn() && (uid() == responderId ||
        (role() == 'dispatcher' && request.auth.token.centerId == resource.data.centerId));
    }

    match /assignments/{id} {
      allow read: if signedIn() && (uid() == resource.data.responderId ||
        (role() == 'dispatcher' && request.auth.token.centerId == resource.data.centerId));
    }

    match /notifications/{id} {
      allow read: if signedIn() && uid() == resource.data.recipientId;
      allow update: if signedIn() && uid() == resource.data.recipientId && onlyChanges(['readAt']);
    }
  }
}
```

Storage: `requests/{requestId}/{file}` may be uploaded only by the owning requester (≤ 5 MB, `image/*`) and read by rescue participants. Storage rules read Firestore with `firestore.get()`.

## 8. AI triage

```mermaid
sequenceDiagram
  autonumber
  participant T as domain-events job (RescueRequested)
  participant H as AssessTriageHandler
  participant ACL as ClaudeTriageModel (ACL)
  participant API as Claude API
  participant Repo as RequestRepository

  T->>H: execute(requestId)
  H->>H: check aiProcessing consent, build input WITHOUT name/phone/national ID
  H->>ACL: assess(input) with 8-second timeout
  ACL->>API: messages (system prompt v1 + tool schema), photos if consented
  API-->>ACL: tool_use JSON
  ACL->>ACL: zod parse → TriageResult, on failure TriageUnavailable
  ACL-->>H: TriageResult
  H->>Repo: transaction: request.applyTriage(result) (severity = max)
  Note over H: severity raised to ≥ 4 and status = PENDING → ExpandRadius now
```

- **Model:** `claude-haiku-5-5` for text only, `claude-sonnet-5-5` when photos are attached. The model id and `promptVersion` are stored in `triage` for traceability.
- **Output schema** (tool `report_triage`): `category` (TRI-01 enum), `severity` (1..5), `confidence` (0..1), `summary` (≤ 160 characters, Vietnamese), `firstAid` (3..5 strings), `needs` (enum array).
- **Prompt** lives in `services/api/src/infrastructure/triage/prompts/v1.md`, instructing: when unsure, choose the higher severity; never give a medical diagnosis; first aid follows general public guidance.
- **Resilience:** 8-second timeout, one retry on 5xx/429, a simple circuit breaker (disable AI for 5 minutes after 5 consecutive failures). Every failure is logged, never thrown out of the handler.
- **Secret:** `ANTHROPIC_API_KEY` from the hosting provider's secret store, read through the validated config module.
- **Evaluation:** `services/api/eval/triage-cases.jsonl` (50 to 100 labelled cases); `pnpm eval:triage` prints a confusion matrix and the under-triage rate.

## 9. Mobile app

- **Server state:** Firestore listeners wrapped in per-feature hooks (`useRescueRequest(id)`, `usePendingRequestsForCenter()`), returning `{ data, error, loading }`; commands go through the feature's `api.ts` using a small `fetch` client that attaches the ID token and an `Idempotency-Key`, with zod output parsing.
- **Errors:** every command returns `Result<T, AppError>`; `AppError` maps the response `code` to a localized message; no empty `catch {}` (ESLint `no-empty` as error).
- **SOS button:** a small client-side state machine `idle → holding → countdown → sending → sent | failed`; on `failed` due to no network, the request is queued (AsyncStorage) and retried with backoff, and a "Call 115" button is shown.
- **Location:** `react-native-geolocation-service` (drop `@react-native-community/geolocation`), fresh fix with `maximumAge: 120000`; Android foreground service while a rescue is active.
- **Notifications:** `@react-native-firebase/messaging` + Notifee (replacing the unmaintained `react-native-push-notification`), high-priority channel `sos-critical`.
- **Role-based navigation:** read `role` from ID token claims (`getIdTokenResult`), not from Firestore.

## 10. Error handling and observability

| Layer | Approach |
| --- | --- |
| Domain | Errors are classes with a `code` (`InvalidTransitionError`, `InvariantViolation`) |
| Application / HTTP | A global exception filter maps domain errors to HTTP status + `{ code, message }` (§4) |
| Infrastructure | Bounded retries; unrecoverable errors logged with `severity=ERROR` and `requestId` |
| Logs | `nestjs-pino` JSON: `requestId`, `eventId`, `actorId`, HTTP request id (never phone numbers or descriptions) |
| Alerts | 5xx rate > 1% / 5 min; failed BullMQ jobs > 0; `POST /v1/requests` p95 > 3 seconds; `/health/ready` failing |
