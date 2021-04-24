import { Entity, Column, OneToOne } from 'typeorm';
import { IsString, Length } from 'class-validator';
import { UserProfile } from './user-profile.entity';
import { BaseTimestampedEntity } from '../common/base-timestamped.entity';

/**
 * Separation of user entity in order to be used without exposing any PII
 * @extends BaseTimestampedEntity
 */
@Entity()
export class User extends BaseTimestampedEntity {
  @IsString()
  @Column({ unique: true })
  username!: string;

  @IsString()
  @Length(8, 40)
  @Column()
  password!: string;

  @OneToOne(() => UserProfile, (profile) => profile.user, {
    cascade: true,
  })
  profile!: UserProfile;
}
