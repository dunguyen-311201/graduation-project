import "reflect-metadata";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { loadEnv } from "./config/env.js";
import { AppModule, configureApp } from "./app.module.js";

const env = loadEnv();
const app = await NestFactory.create(AppModule.forRoot(env));
configureApp(app, env);
await app.listen(env.PORT, "0.0.0.0");
new Logger("Bootstrap").log(`SOS API (${env.APP_ENV}) listening on :${env.PORT}`);
