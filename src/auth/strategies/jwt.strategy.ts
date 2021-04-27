import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenUserPayload, jwtIssuer } from '../constants';
import { UserObject } from '../../common/helpers';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      issuer: jwtIssuer,
      secretOrKey: configService.get<string>('jwtSecret'),
    });
  }

  /**
   * Accept a verified JWT and return the UserObject that will be assigned to
   * the request object
   * @param {JsonWebTokenUserPayload} payload - The verified JWT payload
   */
  validate(payload: JsonWebTokenUserPayload): UserObject {
    return { id: payload.sub, username: payload.username };
  }
}
