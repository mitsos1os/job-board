import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { createLogger } from './logger';
import { attachSwaggerToApp } from './swagger';
import * as helmet from 'helmet';
import { createRequestLoggingMiddleware } from './middleware/request-logger.middleware';

async function bootstrap() {
  const logger = createLogger({ service: 'job-board' });
  const app = await NestFactory.create(AppModule, {
    logger,
  });
  app.use(helmet()); // enable helmet
  app.use(createRequestLoggingMiddleware(logger));
  app.setGlobalPrefix('/api/v1');
  attachSwaggerToApp(app, '/api/v1/explorer');
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  await app.listen(<number>port);
  logger.log(`Application started listening on port: ${port}`);
}
bootstrap();
