import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HealthResolver {
  @Query(/* istanbul ignore next */ () => String)
  health(): string {
    return 'ok';
  }
}
