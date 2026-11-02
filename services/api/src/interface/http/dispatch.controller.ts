import { Body, Controller, HttpCode, Param, Post, Put } from "@nestjs/common";
import {
  assignResponderSchema,
  type AssignResponderBody,
  setAvailabilitySchema,
  type SetAvailabilityBody,
} from "@sos/contracts";
import { DispatchHandlers } from "../../application/dispatch.handlers.js";
import type { Actor } from "../../application/ports.js";
import { CurrentActor } from "./auth.guard.js";

@Controller("v1")
export class DispatchController {
  constructor(private readonly dispatch: DispatchHandlers) {}

  @Post("requests/:id/claim")
  @HttpCode(200)
  claim(@Param("id") id: string, @CurrentActor() actor: Actor) {
    return this.dispatch.claim(id, actor);
  }

  @Post("requests/:id/assignments")
  @HttpCode(201)
  assign(
    @Param("id") id: string,
    @Body({ schema: assignResponderSchema }) body: AssignResponderBody,
    @CurrentActor() actor: Actor,
  ) {
    return this.dispatch.assign(id, body.responderId, actor);
  }

  @Post("requests/:id/complete")
  @HttpCode(200)
  complete(@Param("id") id: string, @CurrentActor() actor: Actor) {
    return this.dispatch.complete(id, actor);
  }

  @Post("assignments/:id/accept")
  @HttpCode(200)
  accept(@Param("id") id: string, @CurrentActor() actor: Actor) {
    return this.dispatch.accept(id, actor);
  }

  @Post("assignments/:id/reject")
  @HttpCode(200)
  reject(@Param("id") id: string, @CurrentActor() actor: Actor) {
    return this.dispatch.reject(id, actor);
  }

  @Post("responders/:id/disable")
  @HttpCode(200)
  disable(@Param("id") id: string, @CurrentActor() actor: Actor) {
    return this.dispatch.setDisabled(id, true, actor);
  }

  @Post("responders/:id/enable")
  @HttpCode(200)
  enable(@Param("id") id: string, @CurrentActor() actor: Actor) {
    return this.dispatch.setDisabled(id, false, actor);
  }

  @Put("responders/me/availability")
  setAvailability(@Body({ schema: setAvailabilitySchema }) body: SetAvailabilityBody, @CurrentActor() actor: Actor) {
    return this.dispatch.setAvailability(body.availability, actor);
  }
}
