import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { createLogger } from './logger';

async function bootstrap() {
  const logger = createLogger({ service: 'job-board' });
  const app = await NestFactory.create(AppModule, {
    logger,
  });
  app.setGlobalPrefix('/api/v1');
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  await app.listen(<number>port);
  logger.log(`Application started listening on port: ${port}`);
}
bootstrap();
