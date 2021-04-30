import { Company } from '../company.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { OmitType } from '@nestjs/swagger';

export class CompanyResponseDto extends OmitType(Company, ['userId'] as const) {
  @Exclude()
  @ApiHideProperty()
  userId!: Company['userId'];
}
