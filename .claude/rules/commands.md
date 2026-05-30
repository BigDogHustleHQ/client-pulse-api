# Commands

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
