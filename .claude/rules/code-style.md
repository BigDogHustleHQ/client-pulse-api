---
paths:
  - "src/**/*.ts"
  - "test/**/*.ts"
---

# Code style

- Prefer `const fn = () => {}` over `function fn() {}` — enforced by ESLint `func-style`/`prefer-arrow-callback`
- **Prettier** — single quotes, 2-space tabs, trailing commas
- **Stack:** NestJS 11 + TypeScript 5, GraphQL via `@nestjs/graphql` + `@nestjs/apollo` + Apollo Server 5, Jest 30 + `ts-jest`, ESLint 9 flat config with `eslint-plugin-prettier`
