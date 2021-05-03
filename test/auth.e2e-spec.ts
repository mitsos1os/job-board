import { INestApplication } from '@nestjs/common';
import {
  appModuleInitializer,
  createAppUser,
  clearCreatedUser,
} from './e2e-helpers';
import { User } from '../src/users/user.entity';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignupResponseDto } from '../src/auth/dto/signup.dto';

describe('Testing authentication', () => {
  let app: INestApplication;
  let testRequest: request.SuperTest<request.Test>;
  let dummyUser: SignupResponseDto;
  let userRepo: Repository<User>;
  const MAIN_AUTH_PATH = '/auth';
  const dummyUserCredentials = {
    // create a user to have in place
    username: 'e2e-mitsos',
    password: 'fakePass',
    email: 'meremetis@e2e.com',
  };
  beforeAll(async () => {
    app = await appModuleInitializer();
    testRequest = request(app.getHttpServer());

    userRepo = app.get(getRepositoryToken(User));
    dummyUser = await createAppUser(app, dummyUserCredentials);
  });
  afterAll(async () => {
    // clear db
    await clearCreatedUser(app, {
      username: dummyUser.username,
    });
    await app.close();
  });
  describe('Testing sign up', () => {
    const userToCreate = {
      username: 'newUser',
      password: 'someFakePass',
      email: 'kapoios@kapou.com',
    };
    const SIGN_UP_PATH = `${MAIN_AUTH_PATH}/signup`;
    afterAll(async () => {
      // clear db
      await userRepo.delete({
        username: userToCreate.username,
      });
    });
    it('should return a BadRequest exception when user already exists', async () => {
      const existingUser = {
        ...userToCreate,
        username: dummyUser.username, // use existing username
      };
      return testRequest
        .post(SIGN_UP_PATH)
        .send(existingUser)
        .expect(400)
        .expect(
          ({
            body: {
              message: [msg],
            },
          }) => {
            expect(msg).toMatch('username');
          },
        );
    });
    it('should return a BadRequest exception when email already exists', async () => {
      const existingMail = {
        ...userToCreate,
        email: 'meremetis@e2e.com', // use existing email
      };
      return testRequest
        .post(SIGN_UP_PATH)
        .send(existingMail)
        .expect(400)
        .expect(
          ({
            body: {
              message: [msg],
            },
          }) => {
            expect(msg).toMatch('email');
          },
        );
    });
    it('should return the id of the created user upon successful creation', async () => {
      return testRequest
        .post(SIGN_UP_PATH)
        .send(userToCreate)
        .expect(201)
        .expect(({ body }) => {
          expect(body).toMatchObject({
            username: userToCreate.username,
            email: userToCreate.email,
          });
          expect(typeof body.id).toBe('number');
        });
    });
  });
  describe('Testing log in', () => {
    const LOGIN_PATH = `${MAIN_AUTH_PATH}/login`;
    it('should return Unauthorized when invalid username', async () => {
      return testRequest
        .post(LOGIN_PATH)
        .send({
          username: 'otherUser',
          password: 'otherpass',
        })
        .expect(401);
    });
    it('should return Unauthorized when invalid password', async () => {
      return testRequest
        .post(LOGIN_PATH)
        .send({
          username: dummyUserCredentials.username,
          password: 'otherpass',
        })
        .expect(401);
    });
    it('should return access token after successful login', async () => {
      return testRequest
        .post(LOGIN_PATH)
        .send({
          username: dummyUserCredentials.username,
          password: dummyUserCredentials.password,
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body).toHaveProperty('access_token');
          expect(typeof body.access_token).toBe('string');
        });
    });
  });
});
