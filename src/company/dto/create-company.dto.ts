import { Company } from '../company.entity';
import { CreateCompanyAddressDto } from './create-company-address.dto';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { omitBaseTimestampedProperties } from '../../common/helpers';

export class CreateCompanyDto extends omitBaseTimestampedProperties(Company, [
  'deletedAt',
  'jobs',
  'user',
  'addresses',
]) {
  @IsOptional() // we need to include some decorators, in order for the property to have metadata and pass whitelist check
  @ValidateNested()
  @Type(() => CreateCompanyAddressDto)
  addresses?: CreateCompanyAddressDto[];
}
