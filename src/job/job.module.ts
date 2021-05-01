import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './job.entity';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [TypeOrmModule.forFeature([Job]), CompanyModule],
  providers: [JobService],
  controllers: [JobController],
})
export class JobModule {}
