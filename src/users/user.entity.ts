import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { IsString, MinLength } from 'class-validator';
import { UserProfile } from './user-profile.entity';
import { BaseTimestampedEntity } from '../common/base-timestamped.entity';
import { Company } from '../company/company.entity';
import { Job } from '../job/job.entity';

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
  @MinLength(8)
  @Column()
  password!: string;

  @OneToOne(() => UserProfile, (profile) => profile.user, {
    cascade: true,
  })
  profile!: UserProfile;

  @OneToMany(() => Company, (company) => company.user)
  companies?: Company[];

  @OneToMany(() => Job, (job) => job.user)
  jobs?: Job[];
}
