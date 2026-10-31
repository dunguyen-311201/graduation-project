import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { createTestApp } from "./setup.js";
import type { FakeIdentityProvider, InMemoryUserDirectory } from "./fakes.js";

let app: INestApplication;
let identity: FakeIdentityProvider;
let users: InMemoryUserDirectory;
const http = () => request(app.getHttpServer());
const valid = { displayName: "Nguyen Van A", email: "a@center.vn", password: "secret123" };

beforeEach(async () => {
  ({ app, identity, users } = await createTestApp());
  users.docs.set("center-1", { role: "center", statusRegistration: "approved" });
  users.docs.set("center-2", { role: "center", statusRegistration: "pending" });
  users.docs.set("user-1", { role: "user" });
});
afterEach(async () => {
  await app.close();
});

describe("health", () => {
  it("answers liveness without a token", async () => {
    await http().get("/health/live").expect(200, { status: "ok" });
  });
});

describe("POST /v1/responders (CTR-02, T-RUL-09)", () => {
  it("rejects a missing or invalid token with 401", async () => {
    await http().post("/v1/responders").send(valid).expect(401);
    await http().post("/v1/responders").set("Authorization", "Bearer nope").send(valid).expect(401);
  });

  it("rejects callers that are not a rescue center", async () => {
    const res = await http().post("/v1/responders").set("Authorization", "Bearer token-user-1").send(valid).expect(403);
    expect(res.body.code).toBe("NOT_A_DISPATCHER");
  });

  it("rejects a center that is not approved yet", async () => {
    const res = await http().post("/v1/responders").set("Authorization", "Bearer token-center-2").send(valid).expect(403);
    expect(res.body.code).toBe("CENTER_NOT_APPROVED");
  });

  it("validates the body", async () => {
    await http()
      .post("/v1/responders")
      .set("Authorization", "Bearer token-center-1")
      .send({ ...valid, email: "not-an-email" })
      .expect(400);
  });

  it("creates the responder for the caller's own center, ignoring centerID in the body", async () => {
    const res = await http()
      .post("/v1/responders")
      .set("Authorization", "Bearer token-center-1")
      .send({ ...valid, centerID: "center-2" })
      .expect(201);
    const id = res.body.responderId as string;
    expect(users.docs.get(id)).toMatchObject({ role: "worker", centerID: "center-1", status: "unavailable", disabled: false });
    expect(identity.claims.get(id)).toEqual({ role: "responder", centerId: "center-1" });
  });

  it("returns 409 EMAIL_EXISTS for a duplicate email", async () => {
    const auth = { Authorization: "Bearer token-center-1" };
    await http().post("/v1/responders").set(auth).send(valid).expect(201);
    const res = await http().post("/v1/responders").set(auth).send(valid).expect(409);
    expect(res.body.code).toBe("EMAIL_EXISTS");
  });

  it("deletes the Auth account if the profile cannot be saved", async () => {
    users.failNextCreate = true;
    await http().post("/v1/responders").set("Authorization", "Bearer token-center-1").send(valid).expect(500);
    expect(identity.deleted).toHaveLength(1);
    expect(identity.users.size).toBe(0);
  });
});
