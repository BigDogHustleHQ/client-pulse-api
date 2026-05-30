import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ClerkModule } from './auth/clerk.module';
import { HealthModule } from './health/health.module';
import { LoggerModule } from './logger/logger.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    LoggerModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req }: { req: Request }) => ({ req }),
    }),
    ClerkModule,
    HealthModule,
    UserModule,
  ],
})
export class AppModule {}
