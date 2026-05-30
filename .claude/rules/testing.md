# Testing conventions

- Unit test files use `.spec.ts` suffix (NestJS default), co-located with source
- Use `@nestjs/testing` `Test.createTestingModule()` to wire up isolated module contexts
- Integration tests use **Cucumber** under `test/integration/`, **one `.feature` file per GraphQL endpoint**:
  - `features/<endpoint>.feature` — Gherkin scenarios for that endpoint
  - `steps/` — reusable step definitions (generic GraphQL request/assert steps live in `graphql.steps.ts`)
  - `support/context.ts` — module-scoped harness that boots/teardowns the Nest app once and holds per-scenario state (no Cucumber `World`, so steps stay `const` arrows)
  - Config is `cucumber.mjs`; ts-node transpiles via `test/integration/tsconfig.json` (CommonJS)
  - Add a new endpoint test by dropping in a `<endpoint>.feature` — reuse the shared steps, only add endpoint-specific steps when needed
