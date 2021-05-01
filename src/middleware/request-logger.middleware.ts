/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '@nestjs/common';

export const createRequestLoggingMiddleware = (logger: LoggerService) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();
  const { method, originalUrl } = req;
  logger.debug!({
    message: `HTTP-${method} request on ${originalUrl}`,
    method,
    originalUrl,
  });
  res.once('finish', () => {
    const { statusCode } = res;
    logger.debug!({
      message: `HTTP-${statusCode} on ${method} at ${originalUrl}`,
      duration: Date.now() - start,
      method,
      originalUrl,
      statusCode,
    });
  });
  next();
};
