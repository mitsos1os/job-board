import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserCredentials } from './user-credentials.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserCredentials])],
})
export class UsersModule {}
