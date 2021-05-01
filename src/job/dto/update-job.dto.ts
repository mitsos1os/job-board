import { CreateJobDto } from './create-job.dto';
import { OmitType, PartialType } from '@nestjs/swagger';

export class UpdateJobDto extends PartialType(
  OmitType(CreateJobDto, ['companyId'] as const),
) {}
