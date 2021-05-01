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

/**
 * Helper to create filtering functions that will provide proper objects
 * to use on filtering and persisting crud requests for user owned entities
 * @param userProperty
 * @param excludeMethods
 */
export const createUserOwnershipFn = (
  userProperty = 'userId',
  excludeMethods?: string[],
) => (req: Request) => {
  if (Array.isArray(excludeMethods) && excludeMethods.includes(req.method)) {
    return {};
  } else {
    return { [userProperty]: (<UserObject>req[USER_REQUEST_KEY])?.id };
  }
};

export const filterUserId = createUserOwnershipFn('userId', ['GET']);

export const persistUserId = createUserOwnershipFn();

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
