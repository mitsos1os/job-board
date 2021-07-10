import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { TestLogger } from '../../test/test-logger';
import { UsersService } from './users.service';
import { UserProfileService } from './user-profile.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';

// Module mocks
jest.mock('@nestjsx/crud-typeorm', () => ({
  // provide mock implementation of TypeOrmCrudService to gain access to repo
  TypeOrmCrudService: class MockTypeOrmCrudService {
    private repo: any;
    constructor(repo: any) {
      this.repo = repo;
    }
  },
}));

describe('UsersService', () => {
  let userService: UsersService;
  const userProfileService = { count: jest.fn() };
  const usersRepo = {
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserProfileService,
          useValue: userProfileService,
        },
        {
          provide: Logger,
          useClass: TestLogger,
        },
        {
          provide: getRepositoryToken(User),
          useValue: usersRepo,
        },
      ],
    }).compile();
    userService = module.get<UsersService>(UsersService);
  });
  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
  describe('Testing create', () => {
    const dummyUserDto = {
      username: 'mitsos',
      password: 'test-mitsos-hashed',
      email: 'mitsos@mitsos.com',
    };
    it('should throw error when email already exists', async () => {
      userProfileService.count.mockResolvedValueOnce(1);
      usersRepo.count.mockResolvedValueOnce(0);
      await expect(userService.create(dummyUserDto)).rejects.toThrow(/email/);
    });
    it('should throw error when username already exists', async () => {
      userProfileService.count.mockResolvedValueOnce(0);
      usersRepo.count.mockResolvedValueOnce(1);
      await expect(userService.create(dummyUserDto)).rejects.toThrow(
        /username/,
      );
    });
    it('should save user when everything ok', async () => {
      userProfileService.count.mockResolvedValueOnce(0);
      usersRepo.count.mockResolvedValueOnce(0);
      const dummyUser = {
        username: dummyUserDto.username,
        password: dummyUserDto.password,
      };
      usersRepo.create.mockReturnValueOnce(dummyUser);
      await userService.create(dummyUserDto);
      expect(usersRepo.save).toHaveBeenCalledWith({
        ...dummyUser,
        profile: { email: dummyUserDto.email },
      });
    });
  });
});
