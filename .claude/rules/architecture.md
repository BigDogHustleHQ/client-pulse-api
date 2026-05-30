# Architecture

NestJS 11 with GraphQL (code-first) via Apollo Server 5.

**GraphQL endpoint:** `POST /graphql` — schema auto-generated at `src/schema.gql` on startup.

Every feature is a NestJS module. The pattern per feature:

```
src/
  <feature>/
    <feature>.module.ts      # registers resolver, service, and imports
    <feature>.resolver.ts    # @Resolver — GraphQL queries and mutations
    <feature>.service.ts     # business logic
    <feature>.resolver.spec.ts
```

`AppModule` (`src/app.module.ts`) is the root — import feature modules here.

## GraphQL — code-first conventions

- `@ObjectType()` + `@Field()` decorators define the schema types
- `@Resolver()` classes handle queries/mutations — no REST controllers
- `@Query(() => ReturnType)` and `@Mutation(() => ReturnType)` for operations
- `@InputType()` for mutation arguments
- Schema is written to `src/schema.gql` automatically — do not edit it by hand
