import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsString, IsEmail, IsOptional } from 'class-validator';
import { User } from './user.entity';
import { ApiHideProperty } from '@nestjs/swagger';

/**
 * Our main User Class containing PII (Personal Identifiable Information) for
 * the user. It will be uniquely linked with user credentials
 * @extends BaseTimestampedEntity
 */
@Entity()
export class UserProfile {
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

  // explicitly define the userId join column to be usable in queries of user profile
  @PrimaryColumn()
  @ApiHideProperty()
  userId!: number;

  @ApiHideProperty()
  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  user!: User;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
