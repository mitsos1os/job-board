import { LoggerService } from '@nestjs/common';
import { User } from '../users/user.entity';

export type LoggerMethods = keyof LoggerService;

/**
 * User Object type missing the password for security reasons
 */
export interface UserObject {
  id: User['id'];
  username: User['username'];
}

/**
 * Helper to create filtering functions that will provide proper objects for
 * to use on filtering and persisting crud requests for user owned entities
 * @param {string} [userProperty = userId]
 */
export const createUserFilteringFn = (userProperty = 'userId') => (
  user: UserObject,
) => ({ [userProperty]: user.id });
