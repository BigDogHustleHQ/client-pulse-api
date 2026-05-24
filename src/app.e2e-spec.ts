import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionResult } from 'graphql';
import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from './app.module';

describe('App (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('health query returns ok', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query: '{ health }' })
      .expect(200)
      .expect((response) => {
        const body = response.body as ExecutionResult<{ health: string }>;
        expect(body.data?.health).toEqual('ok');
      });
  });
});
