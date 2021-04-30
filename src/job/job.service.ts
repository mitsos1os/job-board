import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Job } from './job.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class JobService extends TypeOrmCrudService<Job> {
  constructor(@InjectRepository(Job) private jobRepo: Repository<Job>) {
    super(jobRepo);
  }
}
