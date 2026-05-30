import 'reflect-metadata';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { App } from 'supertest/types';
import { AppModule } from '../../../src/app.module';

/**
 * The Nest application is expensive to boot, so it is started once per test
 * run (see hooks.ts) and shared across every scenario via this module-level
 * singleton.
 */
let app: INestApplication<App> | undefined;

export async function startApp(): Promise<void> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication<INestApplication<App>>();
  await app.init();
}

export async function stopApp(): Promise<void> {
  await app?.close();
  app = undefined;
}

export function getApp(): INestApplication<App> {
  if (!app) {
    throw new Error(
      'Nest application has not been started — did the BeforeAll hook run?',
    );
  }
  return app;
}
