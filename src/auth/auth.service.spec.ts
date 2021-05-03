import { Test, TestingModule } from '@nestjs/testing';
import { AuthService, SALT_ROUNDS } from './auth.service';
import { Logger } from '@nestjs/common';
import { TestLogger } from '../../test/test-logger';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { hash } from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  const userService = {
    create: jest.fn(),
    findOne: jest.fn(),
  };
  const jwtService = {
    signAsync: jest.fn(),
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: userService,
        },
        {
          provide: Logger,
          useClass: TestLogger,
        },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Testing signup', () => {
    userService.create.mockImplementation(async ({ username, email }) => ({
      id: 0,
      username,
      email,
    }));
    const dummyUserDto = {
      username: 'mitsos',
      password: 'mitsos_pass',
      email: 'mitsos@mitsos.com',
    } as const;
    it('should create the user with the hashed password', async () => {
      await service.signUp(dummyUserDto);
      const [[callArg]] = userService.create.mock.calls;
      expect(callArg).toMatchObject({
        username: dummyUserDto.username,
        email: dummyUserDto.email,
      });
      expect(callArg).not.toHaveProperty('password', 'mitsos_pass'); // password should be hashed
    });
    it('should return the created user data', async () => {
      await expect(service.signUp(dummyUserDto)).resolves.toEqual({
        id: 0,
        username: dummyUserDto.username,
        email: dummyUserDto.email,
      });
    });
  });
  describe('Testing validateUser', () => {
    const dummyUser = new User();
    const originalPassword = 'hashedpassword1234';
    beforeAll(async () => {
      Object.assign(dummyUser, {
        id: 1,
        username: 'kapoios',
        password: await hash(originalPassword, SALT_ROUNDS),
        email: 'kapoiosme@email.com',
      });
      userService.findOne.mockImplementation(async ({ username }) =>
        username === dummyUser.username ? dummyUser : null,
      );
    });
    it('should return null when given user not found', async () => {
      await expect(
        service.validateUser('otherUser', 'otherpass'),
      ).resolves.toBeNull();
    });
    it('should return false when incorrect password for user', async () => {
      await expect(
        service.validateUser(dummyUser.username, 'otherpass'),
      ).resolves.toBe(false);
    });
    it('should return user entry stripped from password when valid credentials', async () => {
      const { password, ...strippedUser } = dummyUser;
      await expect(
        service.validateUser(dummyUser.username, originalPassword),
      ).resolves.toEqual(strippedUser);
    });
  });
  describe('Testing login', () => {
    jwtService.signAsync.mockResolvedValue('hashed_jwt_token');
    it('should return the signed access token', async () => {
      await expect(
        service.login({ id: 0, username: 'mitsos' }),
      ).resolves.toEqual({
        access_token: 'hashed_jwt_token',
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        username: 'mitsos',
        sub: 0,
      });
    });
  });
});
