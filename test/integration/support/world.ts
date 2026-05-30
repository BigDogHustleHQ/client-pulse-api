import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import request from 'supertest';
import type { Response } from 'supertest';
import { getApp } from './app';

interface GraphQLResponseBody {
  data?: Record<string, unknown> | null;
  errors?: Array<{ message: string }>;
}

/**
 * Per-scenario Cucumber World. Holds the GraphQL variables being built up by
 * the Given/When steps and the response returned by the API so the Then steps
 * can assert against it.
 */
export class GraphQLWorld extends World {
  variables: Record<string, unknown> = {};
  response?: Response;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async sendOperation(query: string): Promise<void> {
    this.response = await request(getApp().getHttpServer())
      .post('/graphql')
      .send({ query, variables: this.variables });
  }

  get body(): GraphQLResponseBody {
    if (!this.response) {
      throw new Error('No GraphQL response captured yet');
    }
    return this.response.body as GraphQLResponseBody;
  }
}

setWorldConstructor(GraphQLWorld);
