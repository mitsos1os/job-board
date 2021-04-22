import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createLogger } from './logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: createLogger({ service: 'job-board' }),
  });
  await app.listen(3000);
}
bootstrap();
