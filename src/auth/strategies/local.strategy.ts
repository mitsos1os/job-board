import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserObject } from '../../common/helpers';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<UserObject> {
    const user = await this.authService.validateUser(username, password);
    if (user === false) {
      throw new UnauthorizedException([`Wrong password for user ${username}`]);
    } else if (user == null) {
      throw new UnauthorizedException([`User ${username} not found`]);
    }
    return user;
  }
}
