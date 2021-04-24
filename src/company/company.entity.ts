import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { IsOptional, IsString } from 'class-validator';
import { BaseSoftDeleteEntity } from '../common/base-soft-delete.entity';
import { CompanyAddress } from './company-address.entity';
import { User } from '../users/user.entity';
import { Job } from '../job/job.entity';

/**
 * Base company information
 */
@Entity()
export class Company extends BaseSoftDeleteEntity {
  @IsString()
  @Column()
  name!: string;

  @IsOptional()
  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => CompanyAddress, (companyAddress) => companyAddress.company, {
    cascade: true,
  })
  addresses?: CompanyAddress[];

  @ManyToOne(() => User, (user) => user.companies, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user!: User;

  @OneToMany(() => Job, (job) => job.company)
  jobs?: Job;
}
