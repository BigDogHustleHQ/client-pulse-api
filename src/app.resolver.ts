import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(/* istanbul ignore next */ () => String)
  health(): string {
    return 'ok';
  }
}
