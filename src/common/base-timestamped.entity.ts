import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsDate } from 'class-validator';
import { BaseEntity } from './base.entity';

/**
 * Base Entity structure that has the inherited primary ID property, along with
 * timestamp entries that are auto updated during creation / update of records
 *
 * @extends BaseEntity
 */
export abstract class BaseTimestampedEntity extends BaseEntity {
  @IsDate()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @IsDate()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
