import "reflect-metadata";
import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule, configureApp } from "../src/app.module.js";
import { loadEnv } from "../src/config/env.js";
import {
  CENTER_DIRECTORY,
  IDENTITY_PROVIDER,
  NOTIFIER,
  REQUEST_REPOSITORY,
  SCHEDULER,
  USER_DIRECTORY,
} from "../src/application/ports.js";
import {
  FakeCenterDirectory,
  FakeIdentityProvider,
  FakeNotifier,
  FakeScheduler,
  InMemoryRequests,
  InMemoryUserDirectory,
} from "./fakes.js";

export async function createTestApp() {
  const identity = new FakeIdentityProvider();
  const users = new InMemoryUserDirectory();
  const scheduler = new FakeScheduler();
  const notifier = new FakeNotifier();
  const requests = new InMemoryRequests();
  const centers = new FakeCenterDirectory();

  @Global()
  @Module({
    providers: [
      { provide: IDENTITY_PROVIDER, useValue: identity },
      { provide: USER_DIRECTORY, useValue: users },
      { provide: NOTIFIER, useValue: notifier },
      { provide: REQUEST_REPOSITORY, useValue: requests },
      { provide: CENTER_DIRECTORY, useValue: centers },
    ],
    exports: [IDENTITY_PROVIDER, USER_DIRECTORY, NOTIFIER, REQUEST_REPOSITORY, CENTER_DIRECTORY],
  })
  class FakeFirebaseModule {}

  @Global()
  @Module({ providers: [{ provide: SCHEDULER, useValue: scheduler }], exports: [SCHEDULER] })
  class FakeQueueModule {}

  const env = loadEnv({ APP_ENV: "test" });
  const moduleRef = await Test.createTestingModule({ imports: [AppModule.forRoot(env, FakeFirebaseModule, FakeQueueModule)] }).compile();
  const app: INestApplication = moduleRef.createNestApplication();
  configureApp(app, env);
  await app.init();
  return { app, identity, users, scheduler, notifier, requests, centers };
}
