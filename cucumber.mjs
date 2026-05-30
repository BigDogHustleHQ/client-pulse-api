// Cucumber configuration for the integration test suite.
//
// Each GraphQL endpoint gets its own .feature file under
// test/integration/features/. Step definitions and the Nest app harness live
// alongside them and are transpiled on the fly by ts-node using a CommonJS
// tsconfig so they can `require` the application source directly.
process.env.TS_NODE_PROJECT =
  process.env.TS_NODE_PROJECT ?? 'test/integration/tsconfig.json';

export default {
  requireModule: ['ts-node/register'],
  require: ['test/integration/**/*.ts'],
  paths: ['test/integration/features/**/*.feature'],
  format: ['progress-bar', 'summary'],
  formatOptions: { snippetInterface: 'async-await' },
};
