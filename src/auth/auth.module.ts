import { Module } from '@nestjs/common';
import { ClerkModule } from './clerk.module';
import { GqlAuthGuard } from './gql-auth.guard';

@Module({
  imports: [ClerkModule],
  providers: [GqlAuthGuard],
  exports: [GqlAuthGuard],
})
export class AuthModule {}
