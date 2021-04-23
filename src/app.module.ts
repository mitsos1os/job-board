import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { default as configuration, validationSchema } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      validationSchema,
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
