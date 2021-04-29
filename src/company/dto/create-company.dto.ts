import { Company } from '../company.entity';
import { OmitType } from '@nestjs/swagger';
import { CreateCompanyAddressDto } from './create-company-address.dto';

export class CreateCompanyDto extends OmitType(Company, [
  'id',
  'createdAt',
  'deletedAt',
  'updatedAt',
  'jobs',
  'user',
  'addresses',
] as const) {
  addresses?: CreateCompanyAddressDto[];
}
