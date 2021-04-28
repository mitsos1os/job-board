import { User } from '../users/user.entity';

/**
 * Describe the issuer to be validated on JWT tokens
 */
export const jwtIssuer = 'job-board-api-v1';

/**
 * JWT expiration in seconds (1 hour)
 */
export const jwtExpiration = 3600;

/**
 * The payload of the JWT
 */
export interface JsonWebTokenUserPayload {
  sub: User['id'];
  username: User['username'];
}

/**
 * Constant key used for marking routes as public to skip authentication
 * @see Public
 * @see JwtAuthGuard
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * The property on the request object where the validated user object will be
 * attached to
 */
export const USER_REQUEST_KEY = 'user';

export const DEFAULT_CRUD_AUTH_OPTIONS = {
  property: USER_REQUEST_KEY,
};
