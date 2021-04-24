import { Entity, Column, ManyToOne } from 'typeorm';
import { IsString, Length } from 'class-validator';
import { BaseSoftDeleteEntity } from '../common/base-soft-delete.entity';
import { Company } from '../company/company.entity';
import { User } from '../users/user.entity';

@Entity()
export class Job extends BaseSoftDeleteEntity {
  @IsString()
  @Length(10, 100)
  @Column()
  title!: string;

  @IsString()
  @Column({ type: 'text' })
  description!: string;

  @ManyToOne(() => Company, (company) => company.jobs, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  company!: Company;

  @ManyToOne(() => User, (user) => user.jobs, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user!: User;
}
