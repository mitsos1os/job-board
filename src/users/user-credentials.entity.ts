import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { IsString, IsInt, Length } from 'class-validator';
import { User } from './user.entity';

/**
 * Separation of user credentials in order to be used without exposing any PII
 */
@Entity()
export class UserCredentials {
  @IsInt()
  @OneToOne(() => User, (user) => user.credentials, {
    primary: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user!: User;

  @IsString()
  @Column({ unique: true })
  username!: string;

  @IsString()
  @Length(8, 40)
  @Column()
  password!: string;
}
