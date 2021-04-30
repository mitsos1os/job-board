import { Company } from '../company.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

export class CompanyResponseDto extends Company {
  @Exclude()
  @ApiHideProperty()
  userId!: Company['userId'];
}
