import { Global, Module } from '@nestjs/common';
import { createClerkClient } from '@clerk/backend';

export const CLERK_CLIENT = Symbol('CLERK_CLIENT');

@Global()
@Module({
  providers: [
    {
      provide: CLERK_CLIENT,
      useFactory: () =>
        createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY }),
    },
  ],
  exports: [CLERK_CLIENT],
})
export class ClerkModule {}
