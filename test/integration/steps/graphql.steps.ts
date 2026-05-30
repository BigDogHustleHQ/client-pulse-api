import { DataTable, Given, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { GraphQLWorld } from '../support/world';

Given(
  'the GraphQL variables:',
  function (this: GraphQLWorld, table: DataTable) {
    this.variables = table.rowsHash();
  },
);

When(
  'I send the GraphQL operation:',
  async function (this: GraphQLWorld, query: string) {
    await this.sendOperation(query);
  },
);

Then(
  'the response status should be {int}',
  function (this: GraphQLWorld, status: number) {
    assert.ok(this.response, 'No response captured');
    assert.equal(this.response.status, status);
  },
);

Then(
  'there should be no GraphQL errors',
  function (this: GraphQLWorld) {
    assert.equal(
      this.body.errors,
      undefined,
      `Unexpected GraphQL errors: ${JSON.stringify(this.body.errors)}`,
    );
  },
);

Then(
  'the GraphQL field {string} should equal {string}',
  function (this: GraphQLWorld, field: string, expected: string) {
    assert.equal(
      this.body.errors,
      undefined,
      `Unexpected GraphQL errors: ${JSON.stringify(this.body.errors)}`,
    );
    assert.equal(this.body.data?.[field], expected);
  },
);
