import { INestApplication } from '@nestjs/common';
import { appModuleInitializer } from './e2e-helpers';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await appModuleInitializer(true, true); // drop database here
  });

  afterAll(async () => {
    await app.close();
  });
  it('should be defined', () => {
    // basic test to make sure bootstrapping works
    expect(app).toBeDefined();
  });
});
