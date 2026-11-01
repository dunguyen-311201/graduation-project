import { Controller, Get, Inject, ServiceUnavailableException } from "@nestjs/common";
import { SCHEDULER, type Scheduler } from "../../application/ports.js";
import { Public } from "./auth.guard.js";

@Controller("health")
@Public()
export class HealthController {
  constructor(@Inject(SCHEDULER) private readonly scheduler: Scheduler) {}

  /** Liveness for the host health check and the keep-warm ping. Touches no dependency. */
  @Get("live")
  live() {
    return { status: "ok" };
  }

  /** Separate from `live`, so a Redis outage does not make the host restart the API. */
  @Get("ready")
  async ready() {
    await this.scheduler.ping().catch(() => {
      throw new ServiceUnavailableException("Queue backend unavailable");
    });
    return { status: "ok" };
  }
}
