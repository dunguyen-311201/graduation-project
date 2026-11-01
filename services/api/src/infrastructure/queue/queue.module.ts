import { Global, Module } from "@nestjs/common";
import { ENV, type Env } from "../../config/env.js";
import { SCHEDULER } from "../../application/ports.js";
import { BullMqScheduler } from "./bullmq.scheduler.js";

@Global()
@Module({
  providers: [{ provide: SCHEDULER, inject: [ENV], useFactory: (env: Env) => new BullMqScheduler(env.REDIS_URL ?? "") }],
  exports: [SCHEDULER],
})
export class QueueModule {}
