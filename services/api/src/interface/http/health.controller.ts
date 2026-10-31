import { Controller, Get } from "@nestjs/common";
import { Public } from "./auth.guard.js";

@Controller("health")
@Public()
export class HealthController {
  /** Liveness for the host health check and the keep-warm ping. Touches no dependency. */
  @Get("live")
  live() {
    return { status: "ok" };
  }
}
