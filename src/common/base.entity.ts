import { PrimaryGeneratedColumn } from 'typeorm';

/**
 * Our base Entity structure containing the DB Auto Generated Primary column
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;
}
