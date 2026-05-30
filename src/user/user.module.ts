import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [AuthModule],
  providers: [UserResolver, UserService],
})
export class UserModule {}
