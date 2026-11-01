import { Body, Controller, Inject, Put } from "@nestjs/common";
import { registerFcmTokenSchema, type RegisterFcmTokenBody } from "@sos/contracts";
import { type Actor, USER_DIRECTORY, type UserDirectory } from "../../application/ports.js";
import { CurrentActor } from "./auth.guard.js";

@Controller("v1/me")
export class MeController {
  constructor(@Inject(USER_DIRECTORY) private readonly users: UserDirectory) {}

  /** A token always belongs to the caller, so no role check is needed. */
  @Put("fcm-token")
  async registerFcmToken(
    @Body({ schema: registerFcmTokenSchema }) body: RegisterFcmTokenBody,
    @CurrentActor() actor: Actor,
  ) {
    await this.users.addFcmToken(actor.uid, body.token);
    return { ok: true };
  }
}
