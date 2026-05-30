# Architecture

NestJS 11 with GraphQL (code-first) via Apollo Server 5. Every feature is a NestJS module:

```
src/
  <feature>/
    <feature>.module.ts      # registers resolver, service, and imports
    <feature>.resolver.ts    # @Resolver — GraphQL queries and mutations
    <feature>.service.ts     # business logic
    <feature>.resolver.spec.ts
```

`AppModule` (`src/app.module.ts`) is the root. GraphQL endpoint: `POST /graphql` — schema auto-generated at `src/schema.gql` on startup (do not edit by hand). Use `@ObjectType()`/`@Field()` for types, `@Query`/`@Mutation` for operations, `@InputType()` for mutation args.
