import { Controller } from '@nestjs/common';
import { Crud, CrudController, CrudAuth } from '@nestjsx/crud';
import { UserProfile } from './user-profile.entity';
import { UserProfileService } from './user-profile.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { createUserFilteringFn } from '../common/helpers';
import { DEFAULT_CRUD_AUTH_OPTIONS } from '../auth/constants';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';

const userIdFilteringFn = createUserFilteringFn();

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
  ...DEFAULT_CRUD_AUTH_OPTIONS,
  filter: userIdFilteringFn,
  persist: userIdFilteringFn,
})
@Controller('profile')
export class UserProfileController implements CrudController<UserProfile> {
  constructor(public readonly service: UserProfileService) {}
}
