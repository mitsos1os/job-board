import { Module, Logger, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { default as configuration, validate } from './config';
import { TypeOrmModule, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CompanyModule } from './company/company.module';
import { JobModule } from './job/job.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      validate,
      load: [configuration],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: true, // TODO remove after project is done and create migration
        ...configService.get<TypeOrmOptionsFactory>('database'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    CompanyModule,
    JobModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    { provide: APP_PIPE, useClass: ValidationPipe },
  ],
})
export class AppModule {}
