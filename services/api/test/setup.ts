import "reflect-metadata";
import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule, configureApp } from "../src/app.module.js";
import { loadEnv } from "../src/config/env.js";
import { IDENTITY_PROVIDER, USER_DIRECTORY } from "../src/application/ports.js";
import { FakeIdentityProvider, InMemoryUserDirectory } from "./fakes.js";

export async function createTestApp() {
  const identity = new FakeIdentityProvider();
  const users = new InMemoryUserDirectory();

  @Global()
  @Module({
    providers: [
      { provide: IDENTITY_PROVIDER, useValue: identity },
      { provide: USER_DIRECTORY, useValue: users },
    ],
    exports: [IDENTITY_PROVIDER, USER_DIRECTORY],
  })
  class FakeFirebaseModule {}

  const env = loadEnv({ APP_ENV: "test" });
  const moduleRef = await Test.createTestingModule({ imports: [AppModule.forRoot(env, FakeFirebaseModule)] }).compile();
  const app: INestApplication = moduleRef.createNestApplication();
  configureApp(app, env);
  await app.init();
  return { app, identity, users };
}
