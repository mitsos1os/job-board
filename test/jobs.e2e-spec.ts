import { INestApplication } from '@nestjs/common';
import {
  appModuleInitializer,
  clearCreatedUser,
  initAndLoginUser,
  createAppUser,
} from './e2e-helpers';
import * as request from 'supertest';
import { User } from '../src/users/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Job } from '../src/job/job.entity';
import { SignupResponseDto } from '../src/auth/dto/signup.dto';
import { Company } from '../src/company/company.entity';

describe('Testing jobs', () => {
  /*
    Will only test the creation of a job, due to the rest of the api being
    similar to companies and not of any value for exhibition purposes
   */
  let app: INestApplication;
  let testRequest: request.SuperTest<request.Test>;
  let accessToken: string;
  let userId: User['id'];
  let jobRepo: Repository<Job>;
  let companyRepo: Repository<Company>;
  const MAIN_JOB_PATH = '/jobs';
  beforeAll(async () => {
    app = await appModuleInitializer();
    jobRepo = app.get<Repository<Job>>(getRepositoryToken(Job));
    companyRepo = app.get<Repository<Company>>(getRepositoryToken(Company));
    testRequest = request(app.getHttpServer());
    ({ id: userId, accessToken } = await initAndLoginUser(app, {
      username: 'jobs_user',
      password: 'jobs1234',
      email: 'user@jobs-test.com',
    }));
  });
  afterAll(async () => {
    // clear db
    await clearCreatedUser(app, {
      id: userId,
    });
    await app.close();
  });
  describe('creating jobs', () => {
    let otherUser: SignupResponseDto;
    let ownCompany: Company;
    let otherCompany: Company;
    beforeAll(async () => {
      otherUser = await createAppUser(app, {
        username: 'kopria',
        password: 'denteleioneipote',
        email: 'arch@kopria.net',
      });
      [ownCompany, otherCompany] = await Promise.all(
        [
          { name: 'our proper company', userId },
          { name: 'other people company', userId: otherUser.id },
        ].map((c) => companyRepo.save(companyRepo.create(c))),
      );
    });
    afterAll(async () => {
      await jobRepo.delete({ userId }); // delete all jobs from test user
      await Promise.all(
        [ownCompany, otherCompany].map((c) => companyRepo.remove(c)),
      );
      await clearCreatedUser(app, {
        id: otherUser.id,
      });
    });
    it('should not allow to created jobs when not authenticated', async () => {
      return testRequest
        .post(MAIN_JOB_PATH)
        .send({
          title: 'new job for software engineer',
          description: 'It is truly amazing',
          userId,
          companyId: ownCompany.id,
        })
        .expect(401);
    });
    it('should properly create jobs when authenticated and company exists', async () => {
      const { body } = await testRequest
        .post(MAIN_JOB_PATH)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'new job for software engineer',
          description: 'It is truly boring to write tests',
          companyId: ownCompany.id,
        })
        .expect(201);
      expect(body).toHaveProperty('title', 'new job for software engineer');
    });
    it('should not allow to create job under different userId', async () => {
      const { body } = await testRequest
        .post(MAIN_JOB_PATH)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'an other job for IT',
          description: 'You cannot do this',
          userId: otherUser.id,
          companyId: ownCompany.id,
        })
        .expect(201);
      expect(body).toMatchObject({
        title: 'an other job for IT',
      });
      const dbJob = await jobRepo.findOne({ where: { id: body.id } });
      expect(dbJob).toHaveProperty('userId', userId); // not the one we sent
    });
    it('should not allow to create job under not owned companyId', async () => {
      await testRequest
        .post(MAIN_JOB_PATH)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'an other job for IT',
          description: 'You should not do this either',
          companyId: otherCompany.id,
        })
        .expect(401);
    });
  });
  describe('Searching for a job', () => {
    let ownCompany: Company;
    let job1: Job;
    let job2: Job;
    beforeAll(async () => {
      ownCompany = companyRepo.create({ name: 'company1', userId });
      await companyRepo.save(ownCompany);
      [job1, job2] = await Promise.all(
        [
          {
            title: 'Senior Software Architect',
            description: 'unicorn company',
            userId,
            companyId: ownCompany.id,
          },
          {
            title: 'Intermediate DevOps',
            description: 'startup company',
            userId,
            companyId: ownCompany.id,
          },
        ].map((j) => jobRepo.save(jobRepo.create(j))),
      );
    });
    afterAll(async () => {
      await companyRepo.remove(ownCompany);
      await Promise.all([job1, job2].map((j) => jobRepo.remove(j)));
    });
    it('should properly search job titles', async () => {
      const { body } = await testRequest
        .get(MAIN_JOB_PATH)
        .query('filter=title||$contL||architect')
        .expect(200);
      expect(body).toHaveLength(1);
      expect(body[0]).toHaveProperty('id', job1.id);
    });
    it('should properly search job description', async () => {
      const { body } = await testRequest
        .get(MAIN_JOB_PATH)
        .query('filter=description||$contL||Start')
        .expect(200);
      expect(body).toHaveLength(1);
      expect(body[0]).toHaveProperty('id', job2.id);
    });
  });
});
