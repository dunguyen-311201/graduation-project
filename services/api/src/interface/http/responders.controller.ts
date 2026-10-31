import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import type { Actor } from "../../application/ports.js";
import { CreateResponderHandler } from "../../application/create-responder.handler.js";
import { CurrentActor } from "./auth.guard.js";

// Moves to packages/contracts with the monorepo (ADR-0008).
export const createResponderSchema = z.object({
  displayName: z.string().trim().min(1).max(100),
  email: z.email(),
  password: z.string().min(6).max(128),
});
type CreateResponderBody = z.infer<typeof createResponderSchema>;

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
