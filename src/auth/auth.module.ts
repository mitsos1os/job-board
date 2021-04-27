import { Module, Logger } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtIssuer, jwtExpiration } from './constants';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        signOptions: {
          expiresIn: jwtExpiration,
          issuer: jwtIssuer,
        },
        secret: configService.get<string>('jwtSecret'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, Logger, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
