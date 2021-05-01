import { Controller } from '@nestjs/common';
import { Crud, CrudController, CrudAuth } from '@nestjsx/crud';
import { UserProfile } from './user-profile.entity';
import { UserProfileService } from './user-profile.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { persistUserId } from '../common/helpers';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';

@ApiBearerAuth()
@ApiTags('Profile')
@Crud({
  model: { type: UserProfile },
  dto: { update: UpdateProfileDto },
  routes: { only: ['getOneBase', 'updateOneBase'] },
  params: {
    id: { field: 'id', primary: true, disabled: true },
  },
  serialize: { get: UserProfileResponseDto, update: UserProfileResponseDto },
})
@CrudAuth({
  filter: persistUserId,
  persist: persistUserId,
})
@Controller('profile')
export class UserProfileController implements CrudController<UserProfile> {
  constructor(public readonly service: UserProfileService) {}
}
