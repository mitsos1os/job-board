import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';

const {
  format: { combine, timestamp, json },
} = winston;

const defaultConsoleTransport = new winston.transports.Console();

export interface LoggerConfiguration {
  /**
   * The name of the service that will be used for logging
   */
  service: string;
}

export const createLogger = (config: LoggerConfiguration) => {
  const isProduction = process.env.NODE_ENV === 'production';
  // In production used structured json, while simple to view cli otherwise
  const outputFormat = isProduction
    ? json()
    : utilities.format.nestLike(config.service);

  // do not declare type here due to bug in winston definition missing rejectionHandlers property
  const defaultOptions = {
    level: 'debug',
    transports: [defaultConsoleTransport],
    format: combine(timestamp(), outputFormat),
    exceptionHandlers: [defaultConsoleTransport],
    rejectionHandlers: [defaultConsoleTransport],
  };
  const finalOptions = isProduction
    ? { ...defaultOptions, defaultMeta: { service: config.service } }
    : defaultOptions;
  return WinstonModule.createLogger(finalOptions);
};
