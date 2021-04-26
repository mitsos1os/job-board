import { User } from '../user.entity';
import { PickType } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto extends PickType(User, [
  'username',
  'password',
] as const) {
  @IsOptional()
  @IsEmail()
  email?: string;
}
