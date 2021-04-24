import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from './user-profile.entity';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserProfile])],
})
export class UsersModule {}
