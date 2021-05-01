import { Job } from '../job.entity';
import { ApiHideProperty, OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class JobResponseDto extends OmitType(Job, ['userId'] as const) {
  @ApiHideProperty()
  @Exclude()
  userId!: Job['userId'];
}
