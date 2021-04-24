import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { IsString, IsEmail } from 'class-validator';
import { BaseTimestampedEntity } from '../common/base-timestamped.entity';
import { User } from './user.entity';

/**
 * Our main User Class containing PII (Personal Identifiable Information) for
 * the user. It will be uniquely linked with user credentials
 * @extends BaseTimestampedEntity
 */
@Entity()
export class UserProfile extends BaseTimestampedEntity {
  @IsString()
  @Column()
  firstName!: string;

  @IsString()
  @Column()
  lastName!: string;

  @IsEmail()
  @Column({
    unique: true,
  })
  email!: string;

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  user!: User;
}
