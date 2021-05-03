import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { hash, compare } from 'bcrypt';
import { UserObject } from '../common/helpers';
import { JwtService } from '@nestjs/jwt';
import { SignupResponseDto } from './dto/signup.dto';
import { LoginResponseDto } from './dto/login.dto';

/**
 * The number of salt rounds that should be used to use in hashing bcrypt values
 */
export const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private readonly logger: Logger,
    private jwtService: JwtService,
  ) {}

  /**
   * Accept the provided info and register the user, making sure to
   * properly store the given credentials (hashing)
   * @param {CreateUserDto} createUserDto
   */
  async signUp(createUserDto: CreateUserDto): Promise<SignupResponseDto> {
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

  /**
   * Accept a username and password and check their validity against the user
   * saved ones. Return values can be the following:
   * - `null` - user not found
   * - `false` - user found, password does not match
   * - UserObject User object without password field
   * @param {string} username
   * @param {string} password
   * @see UserObject
   */
  async validateUser(
    username: string,
    password: string,
  ): Promise<false | UserObject | null> {
    this.logger.log(`Checking credentials for user ${username}`);
    const user = await this.userService.findOne({ username });
    if (!user) {
      this.logger.warn(`User ${username} not found...`);
      return null;
    }
    const { password: hashedPassword, ...result } = user;
    const passwordMatch = await compare(password, hashedPassword);
    if (!passwordMatch) {
      this.logger.warn(`Incorrect password for User ${username}...`);
      return false;
    }
    this.logger.log(`Successfully authenticated user ${username}...`);
    return result;
  }

  /**
   * Accept a properly authenticated user entity and create - return the
   * appropriate access token for the login
   * @param user
   */
  async login(user: UserObject): Promise<LoginResponseDto> {
    const { username, id } = user;
    this.logger.warn(`Creating access token for user ${username}`);
    const payload = { username, sub: id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
