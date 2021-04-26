import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from './user-profile.entity';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UserProfileService } from './user-profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserProfile])],
  providers: [UsersService, UserProfileService, Logger],
  exports: [UsersService],
})
export class UsersModule {}
