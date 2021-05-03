import { INestApplication } from '@nestjs/common';
import {
  appModuleInitializer,
  clearCreatedUser,
  initAndLoginUser,
  createAppUser,
  basicTestUser,
} from './e2e-helpers';
import { In } from 'typeorm';
import * as request from 'supertest';
import { SignupResponseDto } from '../src/auth/dto/signup.dto';
import { UsersService } from '../src/users/users.service';

describe('Testing profile', () => {
  let app: INestApplication;
  let testRequest: request.SuperTest<request.Test>;
  let usersService: UsersService;
  let accessToken: string;
  const MAIN_PROFILE_PATH = '/profile';
  let secondUser: SignupResponseDto;
  beforeAll(async () => {
    app = await appModuleInitializer();
    testRequest = request(app.getHttpServer());
    accessToken = await initAndLoginUser(app, basicTestUser);
    usersService = app.get<UsersService>(UsersService);
    // create second user
    secondUser = await createAppUser(app, {
      username: 'otheruser',
      password: 'somepass2234',
      email: 'other@elsewhere.com',
    });
  });
  afterAll(async () => {
    // clear db
    await clearCreatedUser(app, {
      username: In([basicTestUser.username, secondUser.username]),
    });
    await app.close();
  });
  describe('Retrieving profile', () => {
    it('should not be able to publicly access user profiles', async () => {
      return testRequest.get(MAIN_PROFILE_PATH).expect(401);
    });
    it('should properly return profile of logged in user', async () => {
      const {
        body: { email },
      } = await testRequest
        .get(MAIN_PROFILE_PATH)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect(email).toEqual(basicTestUser.email);
    });
  });
  describe('Updating profile', () => {
    it('should get Unauthenticated error when no token', async () => {
      return testRequest
        .patch(MAIN_PROFILE_PATH)
        .send({
          firstName: 'kanenas',
        })
        .expect(401);
    });
    it('should successfully update profile of logged in user', async () => {
      const start = Date.now();
      const {
        body: { firstName, updatedAt },
      } = await testRequest
        .patch(MAIN_PROFILE_PATH)
        .send({
          firstName: 'Mitsos',
        })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const end = new Date(updatedAt).getTime();
      expect(firstName).toBe('Mitsos');
      expect(end - start).toBeLessThanOrEqual(100); // less than 100 ms
    });
    it('should not bypass access token and update other user', async () => {
      const {
        body: { firstName },
      } = await testRequest
        .patch(MAIN_PROFILE_PATH)
        .send({
          firstName: 'Allagmenos',
          userId: secondUser.id,
        })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect(firstName).toBe('Allagmenos');
      const dbUser = await usersService.findOne({
        where: { id: secondUser.id },
        relations: ['profile'],
      });
      expect(dbUser?.profile?.firstName).not.toEqual('Allagmenos');
    });
  });
});
