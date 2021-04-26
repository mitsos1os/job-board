import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from './user.entity';
import { UserProfile } from './user-profile.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { CustomError } from '../common/CustomError';
import { LoggerMethods } from '../common/helpers';

export enum UserErrors {
  usernameExists = 'USERNAME_EXISTS',
  emailExists = 'EMAIL_EXISTS',
}

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(UserProfile)
    private userProfileRepo: Repository<UserProfile>,
    private readonly logger: Logger,
  ) {
    super(usersRepo);
  }

  private logErrorAndThrow(
    err: CustomError | Error,
    level: LoggerMethods = 'error',
  ) {
    /**
     * Helper method to log error and then throw it
     * @param {(CustomError | Error)} err
     * @param {LoggerMethods} [level = error]
     * @private
     */
    this.logger[level](err);
    throw err;
  }

  /**
   * Single hand
   * @param {CreateUserDto} createUserDto
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.debug(`Creating new database user`);
    const { email, ...userCredentials } = createUserDto;
    const [existingEmailCount, existingUsernameCount] = await Promise.all([
      this.userProfileRepo.count({ email }),
      this.usersRepo.count({ username: userCredentials.username }),
    ]);
    if (existingEmailCount)
      this.logErrorAndThrow(
        new CustomError(
          'User already registered with same email',
          UserErrors.emailExists,
        ),
        'warn',
      );
    if (existingUsernameCount)
      this.logErrorAndThrow(
        new CustomError(
          'User already registered with same username',
          UserErrors.usernameExists,
        ),
        'warn',
      );
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
