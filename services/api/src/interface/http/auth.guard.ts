import {
  type CanActivate,
  createParamDecorator,
  type ExecutionContext,
  Inject,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import { type Actor, IDENTITY_PROVIDER, type IdentityProvider } from "../../application/ports.js";

const IS_PUBLIC = "isPublic";
/** Opts a route out of the global auth guard (health checks). */
export const Public = () => SetMetadata(IS_PUBLIC, true);

type AuthedRequest = Request & { actor?: Actor };

/**
 * Global guard: every route needs `Authorization: Bearer <Firebase ID token>`
 * unless marked @Public(). The verified caller is exposed as @CurrentActor().
 */
@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(IDENTITY_PROVIDER) private readonly identity: IdentityProvider,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [context.getHandler(), context.getClass()])) {
      return true;
    }
    const req = context.switchToHttp().getRequest<AuthedRequest>();
    const [scheme, token] = (req.headers.authorization ?? "").split(" ");
    if (scheme !== "Bearer" || !token) throw new UnauthorizedException("Missing bearer token");

    let verified;
    try {
      verified = await this.identity.verifyIdToken(token);
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
    const { role, centerId } = verified.claims;
    req.actor = {
      uid: verified.uid,
      role: typeof role === "string" ? role : undefined,
      centerId: typeof centerId === "string" ? centerId : undefined,
    };
    return true;
  }
}

export const CurrentActor = createParamDecorator((_: unknown, ctx: ExecutionContext): Actor => {
  const actor = ctx.switchToHttp().getRequest<AuthedRequest>().actor;
  if (!actor) throw new UnauthorizedException();
  return actor;
});
