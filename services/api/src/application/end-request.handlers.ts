import { ErrorCode } from "@sos/contracts";
import { InvalidTransitionError, RescueRequest } from "@sos/domain";
import { Inject, Injectable } from "@nestjs/common";
import { ConflictError, ForbiddenError, NotFoundError } from "./errors.js";
import {
  type Actor,
  NOTIFIER,
  type Notifier,
  REQUEST_REPOSITORY,
  type RequestRepository,
  RESCUE_STORE,
  type RescueStore,
  SCHEDULER,
  type Scheduler,
} from "./ports.js";

/** SOS-04. Replaces deleting the document, so the history stays. */
@Injectable()
export class CancelSosHandler {
  constructor(
    @Inject(RESCUE_STORE) private readonly store: RescueStore,
    @Inject(SCHEDULER) private readonly scheduler: Scheduler,
  ) {}

  async execute(id: string, actor: Actor) {
    const { status, assignmentId } = await this.store.run(async (tx) => {
      const record = await tx.getRequest(id);
      if (!record) throw new NotFoundError(ErrorCode.REQUEST_NOT_FOUND, "Request not found");
      if (record.requesterId !== actor.uid) {
        throw new ForbiddenError(ErrorCode.NOT_OWNER, "Only the requester can cancel");
      }
      const request = RescueRequest.restore(record);
      try {
        request.transition("CANCELLED");
      } catch (error) {
        if (error instanceof InvalidTransitionError) throw new ConflictError(error.code, error.message);
        throw error;
      }

      const assignmentId = record.activeAssignmentId;
      const assignment = assignmentId ? await tx.getAssignment(assignmentId) : null;
      const responder = assignment ? await tx.getResponder(assignment.responderId) : null;

      if (assignment) tx.setAssignment({ ...assignment, status: "CANCELLED" });
      if (assignment && responder) {
        tx.setResponder({ ...responder, availability: "AVAILABLE", currentAssignmentId: null });
        tx.adjustCenterResponders(assignment.centerId, 1);
      }
      tx.setRequest({
        ...record,
        status: request.snapshot.status,
        activeAssignmentId: null,
        endReason: "CANCELLED_BY_REQUESTER",
      });
      return { status: request.snapshot.status, assignmentId };
    });

    await this.scheduler.cancel(`expire-${id}`);
    if (assignmentId) await this.scheduler.cancel(`timeout-${assignmentId}`);
    return { status };
  }
}

/** Runs from the BullMQ timer. Does nothing unless the request is still PENDING. */
@Injectable()
export class ExpireRequestHandler {
  constructor(
    @Inject(REQUEST_REPOSITORY) private readonly requests: RequestRepository,
    @Inject(NOTIFIER) private readonly notifier: Notifier,
  ) {}

  async execute(id: string) {
    const updated = await this.requests.update(id, (record) =>
      record.status === "PENDING" ? { ...record, status: "EXPIRED", endReason: "NO_CENTER_AVAILABLE" } : null,
    );
    if (updated) {
      await this.notifier.push([updated.requesterId], {
        title: "RESCUE REQUEST",
        body: "There is no rescue service ready to save you!",
        data: { id },
      });
    }
  }
}
