import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { IsString, IsEmail, IsOptional } from 'class-validator';
import { BaseTimestampedEntity } from '../common/base-timestamped.entity';
import { User } from './user.entity';
import { OmitType } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

/**
 * Our main User Class containing PII (Personal Identifiable Information) for
 * the user. It will be uniquely linked with user credentials
 * @extends BaseTimestampedEntity
 */
@Entity()
export class UserProfile extends OmitType(
  BaseTimestampedEntity as Type<BaseTimestampedEntity>,
  ['id'] as const,
) {
  @IsString()
  @Column({ nullable: true })
  @IsOptional()
  firstName?: string;

  @IsString()
  @Column({ nullable: true })
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @Column({
    unique: true,
  })
  email!: string;

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
    nullable: false,
    primary: true,
  })
  @JoinColumn()
  user!: User;
}
