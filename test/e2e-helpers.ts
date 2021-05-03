import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, Logger } from '@nestjs/common';
import { TestLogger } from './test-logger';
import { Connection } from 'typeorm';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { AuthService } from '../src/auth/auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { User } from '../src/users/user.entity';

export const appModuleInitializer = async (init = true, dropDb = false) => {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(Logger)
    .useClass(TestLogger)
    .compile();

  const app = moduleRef.createNestApplication();
  if (init) await app.init();
  if (dropDb) {
    const connection = app.get<Connection>(Connection);
    await connection.dropDatabase();
  }
  return app;
};

export const createAppUser = async (
  app: INestApplication,
  createUserData: CreateUserDto,
) => {
  const authService = app.get<AuthService>(AuthService);
  return authService.signUp(createUserData);
};

export const clearCreatedUser = async (
  app: INestApplication,
  userFilter: Partial<User>,
) => {
  const userRepo = app.get(getRepositoryToken(User));
  return userRepo.delete(userFilter);
};

export const basicTestUser = {
  username: 'test-user',
  password: 'fakepass',
  email: 'test@fake.com',
};

export const getAccessToken = async (
  app: INestApplication,
  credentials: { username: string; password: string },
  loginPath = '/auth/login',
): Promise<string> => {
  const {
    body: { access_token },
  } = await request(app.getHttpServer())
    .post(loginPath)
    .send(credentials)
    .expect(200);
  return access_token;
};

export const initAndLoginUser = async (
  app: INestApplication,
  createUserData: CreateUserDto,
) => {
  await createAppUser(app, createUserData);
  return getAccessToken(app, createUserData);
};
