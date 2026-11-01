import { ErrorCode } from "@sos/contracts";
import { InvalidTransitionError, RescueRequest } from "@sos/domain";
import { Inject, Injectable } from "@nestjs/common";
import { ConflictError, ForbiddenError } from "./errors.js";
import {
  type Actor,
  NOTIFIER,
  type Notifier,
  REQUEST_REPOSITORY,
  type RequestRepository,
  SCHEDULER,
  type Scheduler,
} from "./ports.js";

/** SOS-04. Replaces deleting the document, so the history stays. */
@Injectable()
export class CancelSosHandler {
  constructor(
    @Inject(REQUEST_REPOSITORY) private readonly requests: RequestRepository,
    @Inject(SCHEDULER) private readonly scheduler: Scheduler,
  ) {}

  async execute(id: string, actor: Actor) {
    const updated = await this.requests.update(id, (record) => {
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
      return { ...record, status: request.snapshot.status, endReason: "CANCELLED_BY_REQUESTER" };
    });

    await this.scheduler.cancel(`expire-${id}`);
    return { status: updated?.status };
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
