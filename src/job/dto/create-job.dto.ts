import { Job } from '../job.entity';
import { omitBaseTimestampedProperties } from '../../common/helpers';

export class CreateJobDto extends omitBaseTimestampedProperties(Job, [
  'deletedAt',
  'company',
]) {}
