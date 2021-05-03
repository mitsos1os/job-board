import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, Logger } from '@nestjs/common';
import { TestLogger } from './test-logger';
import { Connection } from 'typeorm';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { AuthService } from '../src/auth/auth.service';

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
  credentials: CreateUserDto,
) => {
  const authService = app.get<AuthService>(AuthService);
  return authService.signUp(credentials);
};
