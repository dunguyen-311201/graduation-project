import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { createResponderSchema, type CreateResponderBody } from "@sos/contracts";
import type { Actor } from "../../application/ports.js";
import { CreateResponderHandler } from "../../application/create-responder.handler.js";
import { CurrentActor } from "./auth.guard.js";

@Controller("v1/responders")
export class RespondersController {
  constructor(private readonly createResponder: CreateResponderHandler) {}

  /** CTR-02. The center is always the caller; any centerID in the body is ignored. */
  @Post()
  @HttpCode(201)
  create(@Body({ schema: createResponderSchema }) body: CreateResponderBody, @CurrentActor() actor: Actor) {
    return this.createResponder.execute(body, actor);
  }
}
