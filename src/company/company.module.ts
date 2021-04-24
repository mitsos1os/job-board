import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { CompanyAddress } from './company-address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, CompanyAddress])],
})
export class CompanyModule {}
