import { DataTable, Given, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import {
  getBody,
  getResponse,
  sendOperation,
  setVariables,
} from '../support/context';

Given('the GraphQL variables:', (table: DataTable): void => {
  setVariables(table.rowsHash());
});

When('I send the GraphQL operation:', async (query: string): Promise<void> => {
  await sendOperation(query);
});

Then('the response status should be {int}', (status: number): void => {
  assert.equal(getResponse().status, status);
});

Then('there should be no GraphQL errors', (): void => {
  const { errors } = getBody();
  assert.equal(
    errors,
    undefined,
    `Unexpected GraphQL errors: ${JSON.stringify(errors)}`,
  );
});

Then(
  'the GraphQL field {string} should equal {string}',
  (field: string, expected: string): void => {
    const body = getBody();
    assert.equal(
      body.errors,
      undefined,
      `Unexpected GraphQL errors: ${JSON.stringify(body.errors)}`,
    );
    assert.equal(body.data?.[field], expected);
  },
);
