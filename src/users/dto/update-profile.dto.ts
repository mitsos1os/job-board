import { OmitType, PartialType } from '@nestjs/swagger';
import { UserProfile } from '../user-profile.entity';

export class UpdateProfileDto extends PartialType(
  OmitType(UserProfile, ['userId', 'updatedAt'] as const),
) {}
