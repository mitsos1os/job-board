import { DeleteDateColumn } from 'typeorm';
import { IsDate } from 'class-validator';
import { BaseTimestampedEntity } from './base-timestamped.entity';

/**
 * Base Entity structure that has the inherited primary ID property, along with
 * timestamp entries that are auto updated during creation / update of records
 *
 * @extends BaseTimestampedEntity
 */
export abstract class BaseSoftDeleteEntity extends BaseTimestampedEntity {
  @IsDate()
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;
}
