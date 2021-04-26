import { Module, Logger } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [UsersModule],
  providers: [AuthService, Logger],
  controllers: [AuthController],
})
export class AuthModule {}
