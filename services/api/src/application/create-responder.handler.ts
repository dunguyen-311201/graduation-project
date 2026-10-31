import { ErrorCode } from "@sos/contracts";
import { Inject, Injectable } from "@nestjs/common";
import { ForbiddenError } from "./errors.js";
import {
  type Actor,
  IDENTITY_PROVIDER,
  type IdentityProvider,
  type LegacyUserRecord,
  USER_DIRECTORY,
  type UserDirectory,
} from "./ports.js";

export interface CreateResponderCommand {
  displayName: string;
  email: string;
  password: string;
}

/**
 * CTR-02: a dispatcher creates a responder account for their own center.
 * Ports the old `POST /users/new-worker` Cloud Function, which had no auth.
 */
@Injectable()
export class CreateResponderHandler {
  constructor(
    @Inject(IDENTITY_PROVIDER) private readonly identity: IdentityProvider,
    @Inject(USER_DIRECTORY) private readonly users: UserDirectory,
  ) {}

  async execute(cmd: CreateResponderCommand, actor: Actor): Promise<{ responderId: string }> {
    // Until custom claims exist (G2), the center is the caller's own `users` document.
    const center = await this.users.get(actor.uid);
    if (!center || center.role !== "center") {
      throw new ForbiddenError(ErrorCode.NOT_A_DISPATCHER, "Only a rescue center can create responders");
    }
    if (center.statusRegistration !== "approved") {
      throw new ForbiddenError(ErrorCode.CENTER_NOT_APPROVED, "The center has not been approved yet");
    }

    const { uid } = await this.identity.createUser(cmd);
    const record: LegacyUserRecord = {
      centerID: actor.uid,
      status: "unavailable",
      role: "worker",
      displayName: cmd.displayName,
      email: cmd.email,
      disabled: false,
    };
    try {
      await this.users.create(uid, record);
      await this.identity.setClaims(uid, { role: "responder", centerId: actor.uid });
    } catch (error) {
      // Never leave an Auth account without its profile document.
      await this.identity.deleteUser(uid).catch(() => undefined);
      throw error;
    }
    return { responderId: uid };
  }
}
