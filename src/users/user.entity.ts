import { Entity, Column, OneToOne } from 'typeorm';
import { IsString, IsEmail } from 'class-validator';
import { BaseTimestampedEntity } from '../common/base-timestamped.entity';
import { UserCredentials } from './user-credentials.entity';

/**
 * Our main User Class containing PII (Personal Identifiable Information) for
 * the user. It will be uniquely linked with user credentials
 * @extends BaseTimestampedEntity
 */
@Entity()
export class User extends BaseTimestampedEntity {
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

  @OneToOne(() => UserCredentials, (credentials) => credentials.user)
  credentials!: UserCredentials;
}
