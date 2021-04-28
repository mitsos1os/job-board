import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

const config = new DocumentBuilder()
  .setTitle('Job Board')
  .setDescription('The Job Board API description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

/**
 * Accept a Nest Application and a path and assign the online swagger
 * documentation on it.
 * @param {INestApplication} app
 * @param {string} [path = explorer] - The path where the swagger Doc will be
 * served
 */
export const attachSwaggerToApp = (
  app: INestApplication,
  path = 'explorer',
) => {
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(path, app, document);
};
