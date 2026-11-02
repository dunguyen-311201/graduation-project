import { Inject, Injectable, type OnModuleInit } from "@nestjs/common";
import { DispatchHandlers } from "../../application/dispatch.handlers.js";
import { ExpireRequestHandler } from "../../application/end-request.handlers.js";
import { REQUEST_REPOSITORY, type RequestRepository, SCHEDULER, type Scheduler } from "../../application/ports.js";

const SWEEP_EVERY_MS = 5 * 60 * 1000;

/** Routes fired BullMQ timers to their handlers (ADR-0012). */
@Injectable()
export class TimersProcessor implements OnModuleInit {
  constructor(
    @Inject(SCHEDULER) private readonly scheduler: Scheduler,
    private readonly expireRequest: ExpireRequestHandler,
    private readonly dispatch: DispatchHandlers,
    @Inject(REQUEST_REPOSITORY) private readonly requests: RequestRepository,
  ) {}

  async onModuleInit() {
    this.scheduler.onTimer(async ({ name, payload }) => {
      if (name === "expire-request" && payload.requestId) {
        await this.expireRequest.execute(payload.requestId);
      }
      if (name === "timeout-assignment" && payload.assignmentId) {
        await this.dispatch.timeout(payload.assignmentId);
      }
      if (name === "sweep") await this.sweep();
    });
    await this.scheduler.scheduleEvery("sweep", SWEEP_EVERY_MS);
  }

  /** Safety net from ADR-0012: free Redis can lose a delayed job on restart. */
  async sweep() {
    const cutoff = Date.now() - SWEEP_EVERY_MS;
    for (const id of await this.requests.listPendingBefore(cutoff)) await this.expireRequest.execute(id);
    for (const id of await this.requests.listOfferedBefore(cutoff)) await this.dispatch.timeout(id);
  }
}
