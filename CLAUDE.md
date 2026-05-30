# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run start:dev        # dev server with watch mode (port 4000)
npm run build            # production build (outputs to dist/)
npm run start:prod       # run production build
npm run lint             # ESLint with auto-fix
npm run format           # Prettier format src/ and test/
npm test                 # unit tests
npm run test:watch       # unit tests in watch mode
npm run test:coverage    # unit tests with coverage
npm run test:integration # Cucumber integration tests (one .feature per endpoint)
```

To run a single test file: `npm test -- src/app.resolver.spec.ts`

To run a single integration feature: `npm run test:integration -- test/integration/features/health.feature`

## Architecture

See `.claude/rules/architecture.md`.

## Testing conventions

- Unit test files use `.spec.ts` suffix (NestJS default), co-located with source
- Use `@nestjs/testing` `Test.createTestingModule()` to wire up isolated module contexts
- Integration tests use **Cucumber** under `test/integration/`, **one `.feature` file per GraphQL endpoint**:
  - `features/<endpoint>.feature` — Gherkin scenarios for that endpoint
  - `steps/` — reusable step definitions (generic GraphQL request/assert steps live in `graphql.steps.ts`)
  - `support/context.ts` — module-scoped harness that boots/teardowns the Nest app once and holds per-scenario state (no Cucumber `World`, so steps stay `const` arrows)
  - Config is `cucumber.mjs`; ts-node transpiles via `test/integration/tsconfig.json` (CommonJS)
  - Add a new endpoint test by dropping in a `<endpoint>.feature` — reuse the shared steps, only add endpoint-specific steps when needed

## Code style

See `.claude/rules/code-style.md`.

## Stack

- **NestJS 11** + **TypeScript 5**
- **GraphQL** via `@nestjs/graphql` + `@nestjs/apollo` + Apollo Server 5
- **Jest 30** + `ts-jest` for unit tests
- **Prettier** — single quotes, 2-space tabs, trailing commas
- **ESLint 9** flat config with `eslint-plugin-prettier`

## This project

ClientPulse API — GraphQL backend for the ClientPulse platform. Deployed to Railway. The Next.js frontend (`client-pulse-frontend`) connects to this service. The Railway deployment also includes a WebSocket service and Integration Hub as separate services.
