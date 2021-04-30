import { LoggerService, Type } from '@nestjs/common';
import { User } from '../users/user.entity';
import { Request } from 'express';
import { USER_REQUEST_KEY } from '../auth/constants';
import { BaseTimestampedEntity } from './base-timestamped.entity';
import { OmitType } from '@nestjs/swagger';

export type LoggerMethods = keyof LoggerService;

/**
 * User Object type missing the password for security reasons
 */
export interface UserObject {
  id: User['id'];
  username: User['username'];
}

export const filterUserId = (req: Request) => {
  return req.method === 'GET'
    ? {}
    : {
        userId: (req[USER_REQUEST_KEY] as UserObject)?.id,
      };
};

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

/**
 * Accept a model and omit its basic inherited properties from
 * BaseTimestampedEntity. Can be useful creating DTOs
 * @param Model
 * @param extraKeysToOmit
 * @see BaseTimestampedEntity
 */
export const omitBaseTimestampedProperties = <
  T extends BaseTimestampedEntity,
  K extends keyof T
>(
  Model: Type<T>,
  extraKeysToOmit: K[] = [],
) => {
  const baseKeys = ['id', 'createdAt', 'updatedAt'] as const;
  return OmitType(Model, [...baseKeys, ...extraKeysToOmit] as const);
};
