import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsString, IsInt, IsEmail } from 'class-validator';

@Entity()
export class User {
  @IsInt()
  @PrimaryGeneratedColumn()
  id!: number;

  @IsString()
  @Column()
  firstName!: string;

  @IsString()
  @Column()
  lastName!: string;

  @IsEmail()
  @Column()
  email!: string;
}
