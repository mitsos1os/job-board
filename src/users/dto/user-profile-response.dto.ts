import { UserProfile } from '../user-profile.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

export class UserProfileResponseDto extends UserProfile {
  @Exclude()
  @ApiHideProperty()
  userId!: number;
}
