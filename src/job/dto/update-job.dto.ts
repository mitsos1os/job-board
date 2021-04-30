import { CreateJobDto } from './create-job.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateJobDto extends PartialType(CreateJobDto) {}
