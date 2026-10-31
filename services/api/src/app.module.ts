import { type DynamicModule, type INestApplication, Module, StandardSchemaValidationPipe } from "@nestjs/common";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import helmet from "helmet";
import { ENV, type Env } from "./config/env.js";
import { FirebaseModule } from "./infrastructure/firebase/firebase.module.js";
import { CreateResponderHandler } from "./application/create-responder.handler.js";
import { FirebaseAuthGuard } from "./interface/http/auth.guard.js";
import { AppErrorFilter } from "./interface/http/app-error.filter.js";
import { HealthController } from "./interface/http/health.controller.js";
import { RespondersController } from "./interface/http/responders.controller.js";

@Module({})
export class AppModule {
  /** `firebase` lets tests swap the Firebase adapters for fakes. */
  static forRoot(env: Env, firebase: DynamicModule | typeof FirebaseModule = FirebaseModule): DynamicModule {
    const envModule: DynamicModule = {
      module: class EnvModule {},
      global: true,
      providers: [{ provide: ENV, useValue: env }],
      exports: [ENV],
    };
    return {
      module: AppModule,
      imports: [envModule, firebase],
      controllers: [HealthController, RespondersController],
      providers: [
        CreateResponderHandler,
        { provide: APP_GUARD, useClass: FirebaseAuthGuard },
        { provide: APP_FILTER, useClass: AppErrorFilter },
      ],
    };
  }
}

/** HTTP setup shared by main.ts and the e2e tests. */
export function configureApp(app: INestApplication, env: Env) {
  app.use(helmet());
  app.enableCors({ origin: env.CORS_ORIGINS, allowedHeaders: ["Authorization", "Content-Type", "Idempotency-Key"] });
  app.useGlobalPipes(new StandardSchemaValidationPipe({ transform: true }));
  app.enableShutdownHooks();
  return app;
}
