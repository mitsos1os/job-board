import { Module, Logger } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [UsersModule],
  providers: [AuthService, Logger, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
