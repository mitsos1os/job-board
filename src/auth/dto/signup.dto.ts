import { User } from '../../users/user.entity';
import { UserProfile } from '../../users/user-profile.entity';
import { PickType, IntersectionType } from '@nestjs/swagger';

export class SignupResponseDto extends IntersectionType(
  PickType(User, ['id', 'username'] as const),
  PickType(UserProfile, ['email'] as const),
) {}
