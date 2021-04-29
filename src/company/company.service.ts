import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Company } from './company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CompanyService extends TypeOrmCrudService<Company> {
  constructor(
    @InjectRepository(Company) private companyRepo: Repository<Company>,
  ) {
    super(companyRepo);
  }
}
