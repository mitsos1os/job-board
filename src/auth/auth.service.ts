import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { hash } from 'bcrypt';

/**
 * The number of salt rounds that should be used to use in hashing bcrypt values
 */
const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private readonly logger: Logger,
  ) {}

  /**
   * Accept the provided info and register the user, making sure to
   * properly store the given credentials (hashing)
   * @param {CreateUserDto} createUserDto
   */
  async signUp(createUserDto: CreateUserDto) {
    const { username, password, email } = createUserDto;
    this.logger.log(`Trying to sign up user with username: ${username}`);
    const hashedPassword = await hash(password, SALT_ROUNDS);
    const createdUser = await this.userService.create({
      username,
      password: hashedPassword,
      email,
    });
    this.logger.log(`Successfully created user with username: ${username}`);
    return { id: createdUser.id, username, email };
  }
}
