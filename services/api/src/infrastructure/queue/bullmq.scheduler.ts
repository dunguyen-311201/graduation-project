import type { OnApplicationShutdown } from "@nestjs/common";
import { Queue } from "bullmq";
import { Redis } from "ioredis";
import type { Scheduler, TimerJob } from "../../application/ports.js";

export const RESCUE_TIMERS_QUEUE = "rescue-timers";

/** BullMQ adapter for the Scheduler port (ADR-0012). */
export class BullMqScheduler implements Scheduler, OnApplicationShutdown {
  private readonly redis: Redis;
  private readonly queue: Queue;

  constructor(url: string) {
    // BullMQ requires maxRetriesPerRequest: null on its connections.
    this.redis = new Redis(url, { maxRetriesPerRequest: null });
    this.queue = new Queue(RESCUE_TIMERS_QUEUE, { connection: this.redis });
  }

  async schedule(job: TimerJob) {
    await this.queue.add(job.name, job.payload, {
      jobId: job.id,
      delay: Math.max(0, job.at.getTime() - Date.now()),
      attempts: 3,
      backoff: { type: "exponential", delay: 1000 },
      removeOnComplete: true,
    });
  }

  async cancel(id: string) {
    await this.queue.remove(id);
  }

  async ping() {
    await this.redis.ping();
  }

  async onApplicationShutdown() {
    await this.queue.close();
    this.redis.disconnect();
  }
}
