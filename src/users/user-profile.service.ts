import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UserProfile } from './user-profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserProfileService extends TypeOrmCrudService<UserProfile> {
  constructor(
    @InjectRepository(UserProfile)
    private userProfileRepo: Repository<UserProfile>,
  ) {
    super(userProfileRepo);
  }
}
