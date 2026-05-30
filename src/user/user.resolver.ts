import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from './user.model';
import { UserService } from './user.service';

interface AuthPayload {
  sub: string;
}

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(GqlAuthGuard)
  @Query(/* istanbul ignore next */ () => User)
  getCurrentUser(@CurrentUser() auth: AuthPayload): Promise<User> {
    return this.userService.getCurrentUser(auth.sub);
  }
}
