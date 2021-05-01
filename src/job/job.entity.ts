import { Entity, Column, ManyToOne } from 'typeorm';
import { IsNumber, IsString, Length } from 'class-validator';
import { BaseSoftDeleteEntity } from '../common/base-soft-delete.entity';
import { Company } from '../company/company.entity';
import { User } from '../users/user.entity';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class Job extends BaseSoftDeleteEntity {
  @IsString()
  @Length(10, 100)
  @Column()
  title!: string;

  @IsString()
  @Column({ type: 'text' })
  description!: string;

  @IsNumber()
  @Column()
  companyId!: number;

  @ApiHideProperty()
  @ManyToOne(() => Company, (company) => company.jobs, {
    onDelete: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  company!: Company;

  @Column()
  @ApiHideProperty()
  userId!: User['id'];

  @ApiHideProperty()
  @ManyToOne(() => User, (user) => user.jobs, {
    onDelete: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  user!: User;
}
