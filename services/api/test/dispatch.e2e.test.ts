import { randomUUID } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { createTestApp } from "./setup.js";
import type { FakeNotifier, FakeScheduler, InMemoryRequests } from "./fakes.js";

let app: INestApplication;
let scheduler: FakeScheduler;
let notifier: FakeNotifier;
let store: InMemoryRequests;
let requestId: string;

const http = () => request(app.getHttpServer());
const post = (path: string, uid: string, body: object = {}) =>
  http().post(path).set("Authorization", `Bearer token-${uid}`).send(body);
const claim = (uid = "center-1") => post(`/v1/requests/${requestId}/claim`, uid);
const assign = (responderId = "worker-1", uid = "center-1") =>
  post(`/v1/requests/${requestId}/assignments`, uid, { responderId });
const assigned = async () => {
  await claim().expect(200);
  return (await assign().expect(201)).body.assignmentId as string;
};
const current = () => store.docs.get(requestId)!;

beforeEach(async () => {
  const ctx = await createTestApp();
  ({ app, scheduler, notifier, requests: store } = ctx);
  ctx.users.docs.set("user-1", { role: "user", displayName: "Test User" });
  ctx.users.docs.set("center-1", { role: "center" });
  ctx.users.docs.set("center-2", { role: "center" });
  ctx.centers.items = [
    { id: "center-1", location: { lat: 16.08, lng: 108.15 }, availableResponders: 2, dispatcherIds: ["center-1"] },
    { id: "center-2", location: { lat: 16.09, lng: 108.15 }, availableResponders: 1, dispatcherIds: ["center-2"] },
  ];
  store.availableResponders.set("center-1", 2);
  for (const [id, centerId] of [
    ["worker-1", "center-1"],
    ["worker-2", "center-2"],
  ] as const) {
    store.responders.set(id, {
      centerId,
      displayName: id,
      availability: "AVAILABLE",
      currentAssignmentId: null,
      disabled: false,
    });
  }
  const res = await post("/v1/requests", "user-1", {
    idempotencyKey: randomUUID(),
    location: { lat: 16.07, lng: 108.15, accuracyM: 10, capturedAt: Date.now() },
  }).expect(201);
  requestId = res.body.requestId;
  notifier.sent = [];
});
afterEach(async () => {
  await app.close();
});

describe("POST /v1/requests/:id/claim (INV-02)", () => {
  it("claims once, stops the expiry timer and tells the requester", async () => {
    expect((await claim().expect(200)).body.status).toBe("CLAIMED");
    await claim().expect(200);
    expect(current().participantIds).toEqual(["user-1", "center-1"]);
    expect(scheduler.jobs.has(`expire-${requestId}`)).toBe(false);
    expect(notifier.sent.map((s) => s.uids)).toEqual([["user-1"]]);
  });

  it("rejects a second center, a center not notified and a requester", async () => {
    await claim().expect(200);
    expect((await claim("center-2").expect(409)).body.code).toBe("ALREADY_CLAIMED");
    current().notifiedCenterIds = ["center-1"];
    expect((await claim("center-2").expect(403)).body.code).toBe("NOT_NOTIFIED");
    expect((await claim("user-1").expect(403)).body.code).toBe("NOT_A_DISPATCHER");
  });
});

describe("POST /v1/requests/:id/assignments (INV-03, INV-04)", () => {
  it("offers the mission, reserves the responder and starts the timeout", async () => {
    const assignmentId = await assigned();
    expect(current()).toMatchObject({ status: "ASSIGNED", activeAssignmentId: assignmentId, responderId: "worker-1" });
    expect(current().participantIds).toContain("worker-1");
    expect(store.assignments.get(assignmentId)?.status).toBe("OFFERED");
    expect(store.responders.get("worker-1")?.availability).toBe("ON_MISSION");
    expect(store.availableResponders.get("center-1")).toBe(1);
    expect(scheduler.jobs.get(`timeout-${assignmentId}`)?.name).toBe("timeout-assignment");
    expect(notifier.sent.at(-1)).toMatchObject({ uids: ["worker-1"], message: { data: { id: requestId, tID: assignmentId } } });
  });

  it("requires the claim, a free responder of the same center and no active offer", async () => {
    expect((await assign().expect(403)).body.code).toBe("NOT_CLAIM_OWNER");
    await claim().expect(200);
    expect((await assign("worker-2").expect(403)).body.code).toBe("RESPONDER_NOT_IN_CENTER");
    store.responders.get("worker-1")!.availability = "OFF_DUTY";
    expect((await assign().expect(409)).body.code).toBe("RESPONDER_UNAVAILABLE");
    store.responders.get("worker-1")!.availability = "AVAILABLE";
    await assign().expect(201);
    expect((await assign().expect(409)).body.code).toBe("ASSIGNMENT_ACTIVE");
  });
});

describe("responder decisions", () => {
  it("accepts: starts the rescue and clears the timeout", async () => {
    const id = await assigned();
    await post(`/v1/assignments/${id}/accept`, "worker-1").expect(200, { requestId, status: "IN_PROGRESS" });
    expect(current().status).toBe("IN_PROGRESS");
    expect(store.assignments.get(id)?.status).toBe("ACCEPTED");
    expect(scheduler.jobs.has(`timeout-${id}`)).toBe(false);
  });

  it("only the assignee can answer, and only while the offer is open", async () => {
    const id = await assigned();
    expect((await post(`/v1/assignments/${id}/accept`, "worker-2").expect(403)).body.code).toBe("NOT_ASSIGNEE");
    await post(`/v1/assignments/${id}/accept`, "worker-1").expect(200);
    expect((await post(`/v1/assignments/${id}/reject`, "worker-1").expect(409)).body.code).toBe("ASSIGNMENT_CLOSED");
    await post("/v1/assignments/nope/accept", "worker-1").expect(404);
  });

  it("rejects: returns the request to the center and frees the responder", async () => {
    const id = await assigned();
    await post(`/v1/assignments/${id}/reject`, "worker-1").expect(200, { ok: true });
    expect(current()).toMatchObject({ status: "CLAIMED", activeAssignmentId: null, responderId: null });
    expect(current().participantIds).not.toContain("worker-1");
    expect(store.responders.get("worker-1")).toMatchObject({ availability: "AVAILABLE", currentAssignmentId: null });
    expect(store.availableResponders.get("center-1")).toBe(2);
    expect(notifier.sent.at(-1)?.uids).toEqual(["center-1"]);
    await assign().expect(201);
  });

  it("times out: takes the responder off duty and tells the center", async () => {
    const id = await assigned();
    await scheduler.fire(`timeout-${id}`);
    expect(store.assignments.get(id)?.status).toBe("TIMED_OUT");
    expect(current().status).toBe("CLAIMED");
    expect(store.responders.get("worker-1")?.availability).toBe("OFF_DUTY");
    expect(store.availableResponders.get("center-1")).toBe(1);
    expect(notifier.sent.at(-1)?.uids).toEqual(["center-1"]);
  });

  it("a timeout after an answer does nothing", async () => {
    const id = await assigned();
    const job = scheduler.jobs.get(`timeout-${id}`)!;
    await post(`/v1/assignments/${id}/accept`, "worker-1").expect(200);
    await scheduler.run(job);
    expect(current().status).toBe("IN_PROGRESS");
  });
});

describe("POST /v1/requests/:id/complete", () => {
  it("ends the rescue, frees everyone and allows a new request", async () => {
    const id = await assigned();
    await post(`/v1/assignments/${id}/accept`, "worker-1").expect(200);
    await post(`/v1/requests/${requestId}/complete`, "worker-1").expect(200, { status: "COMPLETED" });
    expect(current()).toMatchObject({ status: "COMPLETED", endReason: "COMPLETED" });
    expect(store.assignments.get(id)?.status).toBe("COMPLETED");
    expect(store.responders.get("worker-1")?.availability).toBe("AVAILABLE");
    expect(store.availableResponders.get("center-1")).toBe(2);
    expect(notifier.sent.at(-1)?.uids).toEqual(["user-1", "center-1"]);
    await post("/v1/requests", "user-1", {
      idempotencyKey: randomUUID(),
      location: { lat: 16.07, lng: 108.15, accuracyM: 10, capturedAt: Date.now() },
    }).expect(201);
  });

  it("only the assignee can complete, and only after accepting", async () => {
    const id = await assigned();
    const complete = (uid: string) => post(`/v1/requests/${requestId}/complete`, uid);
    expect((await complete("user-1").expect(403)).body.code).toBe("NOT_ASSIGNEE");
    expect((await complete("worker-1").expect(409)).body.code).toBe("INVALID_TRANSITION");
    expect(store.assignments.get(id)?.status).toBe("OFFERED");
  });
});

describe("cancel during dispatch", () => {
  it("closes the offer and releases the responder", async () => {
    const id = await assigned();
    await post(`/v1/requests/${requestId}/cancel`, "user-1").expect(200);
    expect(store.assignments.get(id)?.status).toBe("CANCELLED");
    expect(store.responders.get("worker-1")?.availability).toBe("AVAILABLE");
    expect(store.availableResponders.get("center-1")).toBe(2);
    expect(scheduler.jobs.has(`timeout-${id}`)).toBe(false);
  });
});

describe("PUT /v1/responders/me/availability", () => {
  const set = (uid: string, availability: string) =>
    http().put("/v1/responders/me/availability").set("Authorization", `Bearer token-${uid}`).send({ availability });

  it("toggles availability and the center count", async () => {
    await set("worker-1", "OFF_DUTY").expect(200, { availability: "OFF_DUTY" });
    expect(store.availableResponders.get("center-1")).toBe(1);
    await set("worker-1", "AVAILABLE").expect(200);
    await set("worker-1", "AVAILABLE").expect(200);
    expect(store.availableResponders.get("center-1")).toBe(2);
  });

  it("rejects non-responders, bad values and a responder on a mission", async () => {
    expect((await set("user-1", "AVAILABLE").expect(403)).body.code).toBe("NOT_A_RESPONDER");
    await set("worker-1", "ON_MISSION").expect(400);
    await assigned();
    expect((await set("worker-1", "OFF_DUTY").expect(409)).body.code).toBe("ON_MISSION");
  });
});

describe("POST /v1/responders/:id/disable and enable", () => {
  it("takes the responder out of service and back", async () => {
    await post("/v1/responders/worker-1/disable", "center-1").expect(200, { ok: true });
    expect(store.responders.get("worker-1")).toMatchObject({ disabled: true, availability: "OFF_DUTY" });
    expect(store.availableResponders.get("center-1")).toBe(1);
    const res = await http()
      .put("/v1/responders/me/availability")
      .set("Authorization", "Bearer token-worker-1")
      .send({ availability: "AVAILABLE" })
      .expect(403);
    expect(res.body.code).toBe("DISABLED");
    await post("/v1/responders/worker-1/enable", "center-1").expect(200);
    expect(store.responders.get("worker-1")?.disabled).toBe(false);
  });

  it("rejects other centers and a responder on a mission", async () => {
    expect((await post("/v1/responders/worker-1/disable", "center-2").expect(403)).body.code).toBe(
      "RESPONDER_NOT_IN_CENTER",
    );
    await assigned();
    expect((await post("/v1/responders/worker-1/disable", "center-1").expect(409)).body.code).toBe("ON_MISSION");
  });
});

describe("sweep (ADR-0012)", () => {
  const sixMinutesAgo = () => Date.now() - 6 * 60 * 1000;

  it("repeats every 5 minutes", () => {
    expect(scheduler.repeating.get("sweep")).toBe(5 * 60 * 1000);
  });

  it("expires a pending request whose timer was lost", async () => {
    current().createdAt = sixMinutesAgo();
    await scheduler.run({ name: "sweep", id: "sweep", at: new Date(), payload: {} });
    expect(current().status).toBe("EXPIRED");
  });

  it("closes an offer whose timer was lost", async () => {
    const id = await assigned();
    store.assignments.get(id)!.offeredAt = sixMinutesAgo();
    await scheduler.run({ name: "sweep", id: "sweep", at: new Date(), payload: {} });
    expect(store.assignments.get(id)?.status).toBe("TIMED_OUT");
  });

  it("leaves recent work alone", async () => {
    const id = await assigned();
    await scheduler.run({ name: "sweep", id: "sweep", at: new Date(), payload: {} });
    expect(store.assignments.get(id)?.status).toBe("OFFERED");
  });
});
