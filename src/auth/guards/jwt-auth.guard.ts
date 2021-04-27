import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Check whether handler is marked as public. If not, proceed with regular
   * authentication provided by AuthGuard('jwt'). This is needed because our JWT
   * guard has been applied globally to the application, so all routes are
   * protected except the ones marked as public
   *
   * @param {ExecutionContext} context
   * @see Public
   * @see AuthModule
   */
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
