import 'reflect-metadata';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { Response } from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../../../src/app.module';

interface GraphQLResponseBody {
  data?: Record<string, unknown> | null;
  errors?: Array<{ message: string }>;
}

/**
 * Module-scoped harness shared by the step definitions and hooks. The Nest app
 * is booted once per run (BeforeAll); `variables`/`response` are reset between
 * scenarios (Before) so each scenario starts clean. Kept as plain functions —
 * not a Cucumber World — so every step can be a `const` arrow rather than a
 * `function` bound to `this`.
 */
let app: INestApplication<App> | undefined;
let variables: Record<string, unknown> = {};
let response: Response | undefined;

export const startApp = async (): Promise<void> => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication<INestApplication<App>>();
  await app.init();
};

export const stopApp = async (): Promise<void> => {
  await app?.close();
  app = undefined;
};

export const resetScenario = (): void => {
  variables = {};
  response = undefined;
};

export const setVariables = (vars: Record<string, unknown>): void => {
  variables = vars;
};

export const sendOperation = async (query: string): Promise<void> => {
  if (!app) {
    throw new Error(
      'Nest application has not been started — did the BeforeAll hook run?',
    );
  }
  response = await request(app.getHttpServer())
    .post('/graphql')
    .send({ query, variables });
};

export const getResponse = (): Response => {
  if (!response) {
    throw new Error('No GraphQL response captured yet');
  }
  return response;
};

export const getBody = (): GraphQLResponseBody =>
  getResponse().body as GraphQLResponseBody;
