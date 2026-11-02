import { ErrorCode } from "@sos/contracts";
import { AlreadyClaimedError, InvalidTransitionError, RescueRequest, type RequestStatus } from "@sos/domain";
import { Inject, Injectable } from "@nestjs/common";
import { ConflictError, ForbiddenError, NotFoundError } from "./errors.js";
import {
  type Actor,
  type AssignmentRecord,
  NOTIFIER,
  type Notifier,
  RESCUE_STORE,
  type RescueRequestRecord,
  type RescueStore,
  type RescueTx,
  type ResponderRecord,
  SCHEDULER,
  type Scheduler,
  USER_DIRECTORY,
  type UserDirectory,
} from "./ports.js";

const ASSIGNMENT_TIMEOUT_MS = 60 * 1000;

const asConflict = (error: unknown): never => {
  if (error instanceof InvalidTransitionError || error instanceof AlreadyClaimedError) {
    throw new ConflictError(error.code, error.message);
  }
  throw error;
};

/** INV-05: every status change goes through the domain state machine. */
function moved(record: RescueRequestRecord, to: RequestStatus): RescueRequestRecord {
  try {
    const request = RescueRequest.restore(record);
    request.transition(to);
    return { ...record, status: request.snapshot.status };
  } catch (error) {
    return asConflict(error);
  }
}

async function requestOf(tx: RescueTx, id: string) {
  const record = await tx.getRequest(id);
  if (!record) throw new NotFoundError(ErrorCode.REQUEST_NOT_FOUND, "Request not found");
  return record;
}

async function offeredTo(tx: RescueTx, id: string, responderId: string) {
  const assignment = await assignmentOf(tx, id, responderId);
  if (assignment.status !== "OFFERED") {
    throw new ConflictError(ErrorCode.ASSIGNMENT_CLOSED, "This assignment is closed");
  }
  return assignment;
}

async function assignmentOf(tx: RescueTx, id: string, responderId: string) {
  const assignment = await tx.getAssignment(id);
  if (!assignment) throw new NotFoundError(ErrorCode.ASSIGNMENT_NOT_FOUND, "Assignment not found");
  if (assignment.responderId !== responderId) {
    throw new ForbiddenError(ErrorCode.NOT_ASSIGNEE, "This assignment belongs to another responder");
  }
  return assignment;
}

const free = (responder: ResponderRecord): ResponderRecord => ({
  ...responder,
  availability: "AVAILABLE",
  currentAssignmentId: null,
});

const withoutResponder = (record: RescueRequestRecord, responderId: string): RescueRequestRecord => ({
  ...record,
  activeAssignmentId: null,
  responderId: null,
  participantIds: record.participantIds.filter((id) => id !== responderId),
});

/** Dispatch commands (LLD section 4). They replace the old Firestore triggers. */
@Injectable()
export class DispatchHandlers {
  constructor(
    @Inject(RESCUE_STORE) private readonly store: RescueStore,
    @Inject(USER_DIRECTORY) private readonly users: UserDirectory,
    @Inject(SCHEDULER) private readonly scheduler: Scheduler,
    @Inject(NOTIFIER) private readonly notifier: Notifier,
  ) {}

  private async requireCenter(actor: Actor) {
    const caller = await this.users.get(actor.uid);
    if (caller?.role !== "center") {
      throw new ForbiddenError(ErrorCode.NOT_A_DISPATCHER, "Only a rescue center can do this");
    }
  }

  async claim(requestId: string, actor: Actor) {
    await this.requireCenter(actor);
    const { record, firstClaim } = await this.store.run(async (tx) => {
      const current = await requestOf(tx, requestId);
      if (!current.notifiedCenterIds.includes(actor.uid)) {
        throw new ForbiddenError(ErrorCode.NOT_NOTIFIED, "This request was not sent to your center");
      }
      const request = RescueRequest.restore(current);
      try {
        request.claim(actor.uid);
      } catch (error) {
        asConflict(error);
      }
      if (current.claimedByCenterId === actor.uid) return { record: current, firstClaim: false };

      const claimed = {
        ...current,
        status: request.snapshot.status,
        claimedByCenterId: actor.uid,
        participantIds: [...current.participantIds, actor.uid],
      };
      tx.setRequest(claimed);
      return { record: claimed, firstClaim: true };
    });

    if (firstClaim) {
      await this.scheduler.cancel(`expire-${requestId}`);
      await this.notifier.push([record.requesterId], {
        title: "REQUEST CLAIMED",
        body: "A rescue center has taken your request",
        data: { id: requestId },
      });
    }
    return { status: record.status };
  }

  async assign(requestId: string, responderId: string, actor: Actor) {
    await this.requireCenter(actor);
    const assignment = await this.store.run(async (tx) => {
      const current = await requestOf(tx, requestId);
      const responder = await tx.getResponder(responderId);
      if (current.claimedByCenterId !== actor.uid) {
        throw new ForbiddenError(ErrorCode.NOT_CLAIM_OWNER, "Your center has not claimed this request");
      }
      if (current.activeAssignmentId) {
        throw new ConflictError(ErrorCode.ASSIGNMENT_ACTIVE, "This request already has an active assignment");
      }
      if (!responder || responder.centerId !== actor.uid) {
        throw new ForbiddenError(ErrorCode.RESPONDER_NOT_IN_CENTER, "This responder is not in your center");
      }
      if (responder.availability !== "AVAILABLE" || responder.disabled) {
        throw new ConflictError(ErrorCode.RESPONDER_UNAVAILABLE, "This responder is not available");
      }

      const record: AssignmentRecord = {
        id: tx.newAssignmentId(),
        requestId,
        centerId: actor.uid,
        responderId,
        status: "OFFERED",
        offeredAt: Date.now(),
        version: 1,
      };
      tx.setAssignment(record);
      tx.setRequest({
        ...moved(current, "ASSIGNED"),
        activeAssignmentId: record.id,
        responderId,
        participantIds: [...current.participantIds, responderId],
      });
      tx.setResponder({ ...responder, availability: "ON_MISSION", currentAssignmentId: record.id });
      tx.adjustCenterResponders(actor.uid, -1);
      return record;
    });

    await this.scheduler.schedule({
      name: "timeout-assignment",
      id: `timeout-${assignment.id}`,
      at: new Date(Date.now() + ASSIGNMENT_TIMEOUT_MS),
      payload: { assignmentId: assignment.id },
    });
    await this.notifier.push([responderId], {
      title: "NEW ASSIGNMENT",
      body: "You are assigned to rescue from the center.",
      data: { id: requestId, tID: assignment.id },
    });
    return { assignmentId: assignment.id };
  }

  async accept(assignmentId: string, actor: Actor) {
    const { requestId, requesterId } = await this.store.run(async (tx) => {
      const assignment = await offeredTo(tx, assignmentId, actor.uid);
      const current = await requestOf(tx, assignment.requestId);
      tx.setRequest(moved(current, "IN_PROGRESS"));
      tx.setAssignment({ ...assignment, status: "ACCEPTED", respondedAt: Date.now() });
      return { requestId: current.id, requesterId: current.requesterId };
    });

    await this.scheduler.cancel(`timeout-${assignmentId}`);
    await this.notifier.push([requesterId], {
      title: "RESCUE ON THE WAY",
      body: "A rescue worker has confirmed your request",
      data: { id: requestId },
    });
    return { requestId, status: "IN_PROGRESS" };
  }

  async reject(assignmentId: string, actor: Actor) {
    const assignment = await this.closeOffer(assignmentId, "REJECTED", "AVAILABLE", actor.uid);
    await this.scheduler.cancel(`timeout-${assignmentId}`);
    await this.notifier.push([assignment.centerId], {
      title: "REJECT ASSIGN",
      body: "A worker rejected the assignment",
      data: { id: assignment.requestId },
    });
    return { ok: true };
  }

  /** Runs from the BullMQ timer. Does nothing unless the offer is still open. */
  async timeout(assignmentId: string) {
    const assignment = await this.closeOffer(assignmentId, "TIMED_OUT", "OFF_DUTY").catch((error: unknown) => {
      if (error instanceof ConflictError) return null;
      throw error;
    });
    if (assignment) {
      await this.notifier.push([assignment.centerId], {
        title: "NO RESPONSE",
        body: "The worker did not respond. Assign someone else.",
        data: { id: assignment.requestId },
      });
    }
  }

  private closeOffer(
    assignmentId: string,
    status: "REJECTED" | "TIMED_OUT",
    availability: ResponderRecord["availability"],
    actorId?: string,
  ) {
    return this.store.run(async (tx) => {
      const found = await tx.getAssignment(assignmentId);
      if (!found) throw new NotFoundError(ErrorCode.ASSIGNMENT_NOT_FOUND, "Assignment not found");
      const assignment = await offeredTo(tx, assignmentId, actorId ?? found.responderId);
      const current = await requestOf(tx, assignment.requestId);
      const responder = await tx.getResponder(assignment.responderId);

      const closed = { ...assignment, status, respondedAt: Date.now() };
      tx.setAssignment(closed);
      tx.setRequest(withoutResponder(moved(current, "CLAIMED"), assignment.responderId));
      if (responder) {
        tx.setResponder({ ...free(responder), availability });
        if (availability === "AVAILABLE") tx.adjustCenterResponders(assignment.centerId, 1);
      }
      return closed;
    });
  }

  async complete(requestId: string, actor: Actor) {
    const { requesterId, centerId } = await this.store.run(async (tx) => {
      const current = await requestOf(tx, requestId);
      if (current.responderId !== actor.uid || !current.activeAssignmentId) {
        throw new ForbiddenError(ErrorCode.NOT_ASSIGNEE, "Only the assigned responder can complete this");
      }
      const assignment = await assignmentOf(tx, current.activeAssignmentId, actor.uid);
      const responder = await tx.getResponder(actor.uid);

      tx.setRequest({ ...moved(current, "COMPLETED"), endReason: "COMPLETED" });
      tx.setAssignment({ ...assignment, status: "COMPLETED" });
      if (responder) {
        tx.setResponder(free(responder));
        tx.adjustCenterResponders(assignment.centerId, 1);
      }
      return { requesterId: current.requesterId, centerId: assignment.centerId };
    });

    await this.notifier.push([requesterId, centerId], {
      title: "RESCUE COMPLETED",
      body: "The rescue has been completed",
      data: { id: requestId },
    });
    return { status: "COMPLETED" };
  }

  async setAvailability(availability: "AVAILABLE" | "OFF_DUTY", actor: Actor) {
    return this.store.run(async (tx) => {
      const responder = await tx.getResponder(actor.uid);
      if (!responder) throw new ForbiddenError(ErrorCode.NOT_A_RESPONDER, "Only a responder can do this");
      if (responder.availability === "ON_MISSION") {
        throw new ConflictError(ErrorCode.ON_MISSION, "Finish the current mission first");
      }
      if (responder.availability !== availability) {
        tx.setResponder({ ...responder, availability });
        tx.adjustCenterResponders(responder.centerId, availability === "AVAILABLE" ? 1 : -1);
      }
      return { availability };
    });
  }
}
