import { Entity, Column, ManyToOne } from 'typeorm';
import { IsOptional, IsString } from 'class-validator';
import { BaseTimestampedEntity } from '../common/base-timestamped.entity';
import { Company } from './company.entity';

/**
 * Company Address Information
 */
@Entity()
export class CompanyAddress extends BaseTimestampedEntity {
  /**
   * Address identification name, ex: SubDepartment 1
   */
  @IsString()
  @Column()
  name?: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  street?: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  city?: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  state?: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  postal?: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  country?: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  phone?: string;

  @ManyToOne(() => Company, (company) => company.addresses, {
    onDelete: 'CASCADE',
  })
  company!: Company;
}
