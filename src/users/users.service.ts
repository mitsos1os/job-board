import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from './user.entity';
import { UserProfile } from './user-profile.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private readonly logger: Logger,
  ) {
    super(usersRepo);
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.debug(`Creating new database user`);
    const { email, ...userCredentials } = createUserDto;
    const user = this.usersRepo.create(userCredentials);
    if (email) {
      // we can directly assign profile to be created due to cascade option in
      // our User entity configuration
      user.profile = new UserProfile();
      user.profile.email = email;
    }
    return this.usersRepo.save(user);
  }
}
