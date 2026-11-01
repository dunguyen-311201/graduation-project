import { Inject, Injectable, type OnModuleInit } from "@nestjs/common";
import { ExpireRequestHandler } from "../../application/end-request.handlers.js";
import { SCHEDULER, type Scheduler } from "../../application/ports.js";

/** Routes fired BullMQ timers to their handlers (ADR-0012). */
@Injectable()
export class TimersProcessor implements OnModuleInit {
  constructor(
    @Inject(SCHEDULER) private readonly scheduler: Scheduler,
    private readonly expireRequest: ExpireRequestHandler,
  ) {}

  onModuleInit() {
    this.scheduler.onTimer(async ({ name, payload }) => {
      if (name === "expire-request" && payload.requestId) {
        await this.expireRequest.execute(payload.requestId);
      }
    });
  }
}
