import { Inject, Injectable } from '@nestjs/common';
import type { ClerkClient } from '@clerk/backend';
import { CLERK_CLIENT } from '../auth/clerk.module';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @Inject(CLERK_CLIENT) private readonly clerkClient: ClerkClient,
  ) {}

  async getCurrentUser(clerkId: string): Promise<User> {
    const clerkUser = await this.clerkClient.users.getUser(clerkId);

    return {
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
    };
  }
}
