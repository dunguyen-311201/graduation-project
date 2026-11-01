import { Body, Controller, HttpCode, Param, Post } from "@nestjs/common";
import { raiseSosSchema, type RaiseSosBody } from "@sos/contracts";
import { CancelSosHandler } from "../../application/end-request.handlers.js";
import type { Actor } from "../../application/ports.js";
import { RaiseSosHandler } from "../../application/raise-sos.handler.js";
import { CurrentActor } from "./auth.guard.js";

@Controller("v1/requests")
export class RequestsController {
  constructor(
    private readonly raiseSos: RaiseSosHandler,
    private readonly cancelSos: CancelSosHandler,
  ) {}

  @Post()
  @HttpCode(201)
  raise(@Body({ schema: raiseSosSchema }) body: RaiseSosBody, @CurrentActor() actor: Actor) {
    return this.raiseSos.execute(body, actor);
  }

  @Post(":id/cancel")
  @HttpCode(200)
  cancel(@Param("id") id: string, @CurrentActor() actor: Actor) {
    return this.cancelSos.execute(id, actor);
  }
}
