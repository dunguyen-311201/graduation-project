import { ErrorCode, type RaiseSosBody, type RaiseSosResponse } from "@sos/contracts";
import { findCandidates, RescueRequest } from "@sos/domain";
import { Inject, Injectable } from "@nestjs/common";
import { ForbiddenError } from "./errors.js";
import {
  type Actor,
  CENTER_DIRECTORY,
  type CenterDirectory,
  NOTIFIER,
  type Notifier,
  REQUEST_REPOSITORY,
  type RequestRepository,
  SCHEDULER,
  type Scheduler,
  USER_DIRECTORY,
  type UserDirectory,
} from "./ports.js";

const EXPIRE_AFTER_MS = 3 * 60 * 1000;
const DEFAULT_SEVERITY = 3;

/** SOS-01. Replaces the `newRequest` trigger, with a durable expiry timer. */
@Injectable()
export class RaiseSosHandler {
  constructor(
    @Inject(REQUEST_REPOSITORY) private readonly requests: RequestRepository,
    @Inject(CENTER_DIRECTORY) private readonly centers: CenterDirectory,
    @Inject(USER_DIRECTORY) private readonly users: UserDirectory,
    @Inject(SCHEDULER) private readonly scheduler: Scheduler,
    @Inject(NOTIFIER) private readonly notifier: Notifier,
  ) {}

  async execute(cmd: RaiseSosBody, actor: Actor): Promise<RaiseSosResponse> {
    const caller = await this.users.get(actor.uid);
    if (caller?.role !== "user") {
      throw new ForbiddenError(ErrorCode.NOT_A_REQUESTER, "Only a requester can raise an SOS");
    }

    const existing = await this.requests.findByIdempotencyKey(actor.uid, cmd.idempotencyKey);
    if (existing) return { requestId: existing.id, status: existing.status };

    const { radiusKm, candidates } = findCandidates(cmd.location, await this.centers.listApproved());
    const { id, requesterId, status, claimedByCenterId } = RescueRequest.raise(
      this.requests.newId(),
      actor.uid,
    ).snapshot;

    await this.requests.create({
      id,
      requesterId,
      status,
      claimedByCenterId,
      location: cmd.location,
      category: cmd.category ?? "OTHER",
      severity: cmd.severity ?? DEFAULT_SEVERITY,
      severitySource: cmd.severity ? "REQUESTER" : "DEFAULT",
      description: cmd.description ?? "",
      searchRadiusKm: radiusKm,
      notifiedCenterIds: candidates.map((center) => center.id),
      activeAssignmentId: null,
      responderId: null,
      participantIds: [actor.uid],
      idempotencyKey: cmd.idempotencyKey,
      createdAt: Date.now(),
      version: 1,
    });

    await this.scheduler.schedule({
      name: "expire-request",
      id: `expire-${id}`,
      at: new Date(Date.now() + EXPIRE_AFTER_MS),
      payload: { requestId: id },
    });
    await this.notifier.push(
      candidates.flatMap((center) => center.dispatcherIds),
      { title: "REQUEST RESCUE", body: `${caller.displayName ?? "Someone"} needs rescue`, data: { id } },
    );

    return { requestId: id, status };
  }
}
