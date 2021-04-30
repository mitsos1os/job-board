import { DeleteDateColumn } from 'typeorm';
import { BaseTimestampedEntity } from './base-timestamped.entity';

/**
 * Base Entity structure that has the inherited primary ID property, along with
 * timestamp entries that are auto updated during creation / update of records
 *
 * @extends BaseTimestampedEntity
 */
export abstract class BaseSoftDeleteEntity extends BaseTimestampedEntity {
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;
}
