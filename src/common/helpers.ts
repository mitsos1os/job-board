import { LoggerService } from '@nestjs/common';
import { User } from '../users/user.entity';

export type LoggerMethods = keyof LoggerService;

/**
 * User Object type missing the password for security reasons
 */
export type UserObject = Omit<User, 'password'>;
