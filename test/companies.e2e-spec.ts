import { INestApplication } from '@nestjs/common';
import {
  appModuleInitializer,
  clearCreatedUser,
  initAndLoginUser,
  createAppUser,
} from './e2e-helpers';
import * as request from 'supertest';
import { In, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Company } from '../src/company/company.entity';
import { User } from '../src/users/user.entity';
import { SignupResponseDto } from '../src/auth/dto/signup.dto';

describe('Testing Companies', () => {
  let app: INestApplication;
  let testRequest: request.SuperTest<request.Test>;
  let accessToken: string;
  let userId: User['id'];
  let companyRepo: Repository<Company>;
  const MAIN_COMPANY_PATH = '/companies';
  beforeAll(async () => {
    app = await appModuleInitializer();
    companyRepo = app.get<Repository<Company>>(getRepositoryToken(Company));
    testRequest = request(app.getHttpServer());
    ({ id: userId, accessToken } = await initAndLoginUser(app, {
      username: 'company-user-1',
      password: 'companypass',
      email: 'user@company.net',
    }));
  });
  afterAll(async () => {
    // clear db
    await clearCreatedUser(app, {
      id: userId,
    });
    await app.close();
  });
  describe('Getting company info', () => {
    let company: Company;
    beforeAll(async () => {
      company = companyRepo.create({
        name: 'Some Company Inc',
        description: 'Unicorn',
        userId,
        addresses: [{ name: 'Dept 1', country: 'Greece' }],
      });
      await companyRepo.save(company);
    });
    afterAll(async () => {
      await companyRepo.delete({
        userId,
      });
    });
    it('should successfully return company info when not authenticated', async () => {
      const { body: res } = await testRequest
        .get(MAIN_COMPANY_PATH)
        .expect(200);
      expect(res).toHaveLength(1);
      expect(res[0]).toHaveProperty('id', company.id);
    });
  });
  describe('Creating company info', () => {
    const companyToCreate = {
      name: 'New Company',
      description: 'new kid on the block',
    };
    it('should return unauthorized when not authenticated', async () => {
      return testRequest
        .post(MAIN_COMPANY_PATH)
        .send(companyToCreate)
        .expect(401);
    });
    it('should properly create company under logged in user', async () => {
      const { body } = await testRequest
        .post(MAIN_COMPANY_PATH)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(companyToCreate)
        .expect(201);
      expect(body).toMatchObject(companyToCreate);
      expect(typeof body.id).toBe('number');
      await expect(
        companyRepo.findOne({ where: { id: body.id } }),
      ).resolves.toHaveProperty('userId', userId); // added user Id
    });
    it('should not allow setting different userId in created company', async () => {
      const { body } = await testRequest
        .post(MAIN_COMPANY_PATH)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...companyToCreate, name: 'extra company', userId: userId + 1 }) // dummy user id
        .expect(201);
      expect(body).toHaveProperty('name', 'extra company');
      expect(typeof body.id).toBe('number');
      await expect(
        companyRepo.findOne({ where: { id: body.id } }),
      ).resolves.toHaveProperty('userId', userId); // original user Id
    });
  });
  describe('Updating company info', () => {
    let createdCompany: Company;
    let foreignCompany: Company;
    let otherUser: SignupResponseDto;
    beforeAll(async () => {
      otherUser = await createAppUser(app, {
        username: 'otherUser',
        password: 'somepass',
        email: 'other@ole.com',
      });
      createdCompany = companyRepo.create({ name: 'Proper Inc', userId });
      foreignCompany = companyRepo.create({
        name: 'other company',
        userId: otherUser.id,
      });
      await Promise.all([
        companyRepo.save(createdCompany),
        companyRepo.save(foreignCompany),
      ]);
    });
    afterAll(async () => {
      await Promise.all([
        companyRepo.delete({
          id: In([createdCompany.id, foreignCompany.id]),
        }),
        clearCreatedUser(app, {
          id: otherUser.id,
        }),
      ]);
    });
    it('should not allow updating a company unauthenticated', async () => {
      return testRequest
        .patch(`${MAIN_COMPANY_PATH}/${createdCompany.id}`)
        .send({
          description: 'Updated description',
        })
        .expect(401);
    });
    it('should successfully update company owned by the user', async () => {
      const { body } = await testRequest
        .patch(`${MAIN_COMPANY_PATH}/${createdCompany.id}`)
        .send({
          description: 'Updated description',
        })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect(body).toHaveProperty('description', 'Updated description');
    });
    it('should not be able to update company owned by other user', async () => {
      return testRequest
        .patch(`${MAIN_COMPANY_PATH}/${foreignCompany.id}`)
        .send({
          description: 'other Updated description',
        })
        .expect(401);
    });
  });
  describe('Soft deleting company info', () => {
    let createdCompany: Company;
    beforeAll(async () => {
      createdCompany = companyRepo.create({ name: 'Proper Inc', userId });
      await companyRepo.save(createdCompany);
    });
    afterAll(async () => {
      await companyRepo.delete({
        id: createdCompany.id,
      });
    });
    it('should not allow to soft delete a company when not authenticated', async () => {
      return testRequest
        .delete(`${MAIN_COMPANY_PATH}/${createdCompany.id}`)
        .expect(401);
    });
    it('should properly soft delete the company when authenticated', async () => {
      // first delete the company
      const aboutToDelete = Date.now();
      await testRequest
        .delete(`${MAIN_COMPANY_PATH}/${createdCompany.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
      // re-query to make sure that it does not appear
      await testRequest
        .get(`${MAIN_COMPANY_PATH}/${createdCompany.id}`)
        .expect(404);
      const res = await companyRepo.findOne({
        where: { id: createdCompany.id },
        withDeleted: true,
      });
      const deletedDiff = (res?.deletedAt?.getTime() ?? 0) - aboutToDelete;
      expect(deletedDiff).toBeGreaterThan(0);
      expect(deletedDiff).toBeLessThan(2000); // 2  sec;
    });
    it('should recover the soft deleted company when authenticated', async () => {
      await testRequest
        .patch(`${MAIN_COMPANY_PATH}/${createdCompany.id}/recover`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      // re-query to make sure it is returned now
      const { body } = await testRequest
        .get(`${MAIN_COMPANY_PATH}/${createdCompany.id}`)
        .expect(200);
      expect(body).toHaveProperty('id', createdCompany.id);
    });
  });
});
