import { CompanyAddress } from '../company-address.entity';
import { OmitType } from '@nestjs/swagger';

export class CreateCompanyAddressDto extends OmitType(CompanyAddress, [
  'id',
  'createdAt',
  'updatedAt',
] as const) {}
