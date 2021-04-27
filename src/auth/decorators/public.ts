import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../constants';

/**
 * Decorator for marking handlers as public
 * @constructor
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
