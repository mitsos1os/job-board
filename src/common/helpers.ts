import { LoggerService } from '@nestjs/common';
import { User } from '../users/user.entity';
import { Request } from 'express';
import { USER_REQUEST_KEY } from '../auth/constants';

export type LoggerMethods = keyof LoggerService;

/**
 * User Object type missing the password for security reasons
 */
export interface UserObject {
  id: User['id'];
  username: User['username'];
}

export const persistUserId = (req: Request) => ({
  userId: (req[USER_REQUEST_KEY] as UserObject)?.id,
});
/**
 * Helper to create filtering functions that will provide proper objects for
 * to use on filtering and persisting crud requests for user owned entities
 * @param {string} [userProperty = userId]
 */
export const createUserFilteringFn = (userProperty = 'userId') => (
  user: UserObject,
) => ({ [userProperty]: user.id });
