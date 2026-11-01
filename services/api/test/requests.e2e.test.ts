import { randomUUID } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { createTestApp } from "./setup.js";
import type { FakeNotifier, FakeScheduler, InMemoryRequests } from "./fakes.js";

let app: INestApplication;
let scheduler: FakeScheduler;
let notifier: FakeNotifier;
let requests: InMemoryRequests;
const http = () => request(app.getHttpServer());
const auth = (uid: string) => ["Authorization", `Bearer token-${uid}`] as const;
const body = () => ({
  idempotencyKey: randomUUID(),
  location: { lat: 16.07, lng: 108.15, accuracyM: 10, capturedAt: Date.now() },
  description: "Flat tire",
});
const raise = (data: object = body(), uid = "user-1") =>
  http()
    .post("/v1/requests")
    .set(...auth(uid))
    .send(data);

beforeEach(async () => {
  const ctx = await createTestApp();
  ({ app, scheduler, notifier, requests } = ctx);
  ctx.users.docs.set("user-1", { role: "user", displayName: "Test User" });
  ctx.users.docs.set("user-2", { role: "user" });
  ctx.users.docs.set("center-1", { role: "center" });
  ctx.centers.items = [
    { id: "center-1", location: { lat: 16.08, lng: 108.15 }, availableResponders: 1, dispatcherIds: ["center-1"] },
  ];
});
afterEach(async () => {
  await app.close();
});

describe("POST /v1/requests", () => {
  it("rejects a missing token and an invalid body", async () => {
    await http().post("/v1/requests").send(body()).expect(401);
    await raise({ ...body(), idempotencyKey: "nope" }).expect(400);
  });

  it("rejects callers that are not requesters", async () => {
    const res = await raise(body(), "center-1").expect(403);
    expect(res.body.code).toBe("NOT_A_REQUESTER");
  });

  it("creates a pending request, schedules expiry and notifies nearby centers", async () => {
    const res = await raise().expect(201);
    const { requestId } = res.body;
    expect(res.body.status).toBe("PENDING");
    expect(requests.docs.get(requestId)).toMatchObject({
      requesterId: "user-1",
      notifiedCenterIds: ["center-1"],
      searchRadiusKm: 10,
      category: "OTHER",
      severity: 3,
      severitySource: "DEFAULT",
    });
    expect(scheduler.jobs.get(`expire-${requestId}`)?.name).toBe("expire-request");
    expect(notifier.sent[0]?.uids).toEqual(["center-1"]);
  });

  it("returns the same request for a repeated idempotency key", async () => {
    const data = body();
    const first = await raise(data).expect(201);
    const second = await raise(data).expect(201);
    expect(second.body.requestId).toBe(first.body.requestId);
    expect(requests.docs.size).toBe(1);
  });

  it("rejects a second active request (INV-01)", async () => {
    await raise().expect(201);
    const res = await raise().expect(409);
    expect(res.body.code).toBe("ACTIVE_REQUEST_EXISTS");
  });

  it("still creates the request when no center is in range", async () => {
    const res = await raise({ ...body(), location: { ...body().location, lat: 40 } }).expect(201);
    expect(requests.docs.get(res.body.requestId)?.notifiedCenterIds).toEqual([]);
    expect(notifier.sent[0]?.uids).toEqual([]);
  });
});

describe("POST /v1/requests/:id/cancel", () => {
  it("cancels, clears the timer and allows a new request", async () => {
    const { requestId } = (await raise().expect(201)).body;
    const res = await http()
      .post(`/v1/requests/${requestId}/cancel`)
      .set(...auth("user-1"))
      .expect(200);
    expect(res.body.status).toBe("CANCELLED");
    expect(scheduler.jobs.has(`expire-${requestId}`)).toBe(false);
    await raise().expect(201);
  });

  it("rejects anyone but the owner", async () => {
    const { requestId } = (await raise().expect(201)).body;
    const res = await http()
      .post(`/v1/requests/${requestId}/cancel`)
      .set(...auth("user-2"))
      .expect(403);
    expect(res.body.code).toBe("NOT_OWNER");
  });

  it("answers 404 for an unknown request and 409 for an ended one", async () => {
    await http()
      .post("/v1/requests/nope/cancel")
      .set(...auth("user-1"))
      .expect(404);
    const { requestId } = (await raise().expect(201)).body;
    const cancel = () =>
      http()
        .post(`/v1/requests/${requestId}/cancel`)
        .set(...auth("user-1"));
    await cancel().expect(200);
    expect((await cancel().expect(409)).body.code).toBe("INVALID_TRANSITION");
  });
});

describe("expire-request timer", () => {
  it("expires a pending request, tells the requester and frees the lock", async () => {
    const { requestId } = (await raise().expect(201)).body;
    await scheduler.fire(`expire-${requestId}`);
    expect(requests.docs.get(requestId)).toMatchObject({ status: "EXPIRED", endReason: "NO_CENTER_AVAILABLE" });
    expect(notifier.sent.at(-1)?.uids).toEqual(["user-1"]);
    await raise().expect(201);
  });

  it("does nothing once the request is no longer pending", async () => {
    const { requestId } = (await raise().expect(201)).body;
    const job = scheduler.jobs.get(`expire-${requestId}`);
    await http()
      .post(`/v1/requests/${requestId}/cancel`)
      .set(...auth("user-1"))
      .expect(200);
    await scheduler.run(job!);
    expect(requests.docs.get(requestId)?.status).toBe("CANCELLED");
  });
});
