import { Company } from '../company.entity';
import { OmitType } from '@nestjs/swagger';
import { CreateCompanyAddressDto } from './create-company-address.dto';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

export class CreateCompanyDto extends OmitType(Company, [
  'id',
  'createdAt',
  'deletedAt',
  'updatedAt',
  'jobs',
  'user',
  'addresses',
] as const) {
  @IsOptional() // we need to include some decorators, in order for the property to have metadata and pass whitelist check
  @ValidateNested()
  @Type(() => CreateCompanyAddressDto)
  addresses?: CreateCompanyAddressDto[];
}
