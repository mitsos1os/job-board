# Job Board _(Proof Of Concept)_
## Overview
This project emulates the functionality of a Job Board API that will cover the basic needs of company that wants to create / edit a job board.

**Users can:**
 - Sign-up
 - Login
 - View / Edit their profile

**Authenticated users can:**
 - Create a Company
 - Update a Company
 - Soft delete a Company
 - Recover a Soft-Deleted company
 - Create a job ad
 - Update a job ad
 - Soft delete a job ad
 - Recover a soft-deleted job ad

**Public users can:**
 - Get information for company profiles
 - Get information for job ads
 - Search through job ads

## Requirements
 - Make sure you have **NodeJS > V14.5**
 - The application requires a **PostgreSQL** database server
 - For easily running the project and E2E tests that require a database integration, you should also have **Docker** and **docker-compose** installed as well

## Installation
To install required runtime dependencies, simply run in the project root folder:
```bash
$ npm install
```

## Running the app

### Environment configuration
The application has some parameters that need configuration, such as the database server to connect to, port to listen to, etc...
This configuration is passed on from the environment of the application.

The easiest way to configure the environment is to provide a `.env` file in the project root containing all the required information for the app (as well as docker containers) to run

#### `.env` example
An example `.env` file containing all the required information is this:
```dotenv
# POSTGRES Docker Container
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgresdb1234
POSTGRES_DB=job-board
# PGADMIN
PGADMIN_DEFAULT_EMAIL=admin-mail@hotmail.com
PGADMIN_DEFAULT_PASSWORD=pgadmin_1234
# APP
NODE_ENV=development
PORT=3000
JWT_SECRET=unbreakablejwtpass123
# APP Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=${POSTGRES_DB}
DB_USER=${POSTGRES_USER}
DB_PASS=${POSTGRES_PASSWORD}
```
This will work directly if used in the development project without any changes. If you want to connect to your own **PostgreSQL** server, then you should provide the appropriate values in the **APP Database** section of the `.env` file 

**If not all required environment variables are set, the app will not start and throw the equivalent error!**

#### DB Server
*If you need to spin up a database server, open a terminal and run* 
```bash
$ npm run postgres
```
This will start the required **PostgreSQL** server. *(You need to have **docker-compose** installed)*

### Application start
After having a database server running _(and configuring the proper environment params for the app)_, we can start the application by running:
```bash
$ npm start
```

## Swagger documentation
After running the app you can view the complete **OpenAPI** _(Swagger)_ documentation of the API endpoints on the `/api/v1/explorer`
path of the main server. So for example, if you run the application using the recommended defaults,
the complete Swagger URL should be: `http://localhost:3000/api/v1/explorer`

## Test
Unit Tests are included to cover the most important functionality in isolation.

E2E Tests are also included to make sure that the API behaves as it supposed to and tests all components in integration with each other
```bash
# unit tests
$ npm run test

# e2e tests
$ nohup npm run test-db & # Spin up the test database server and send to background.
$ npm run test:e2e
$ docker-compose down # stop test-db running in the background

# test coverage
$ npm run test:cov
```

## Building
A `Dockerfile` if provided in order to build the application image. You can build it yourself by simply running in the project root:
```bash
$ docker build -t <IMAGE_NAME> .
```

## CI / CD
**Gitlab CI/CD** _(check `.gitlab-ci.yml`)_ has been configured for the project creating jobs for:
 - Linting
 - Unit Testing
 - E2E Testing
 - Building
You can see the pipelines of the project in Gitlab [here](https://gitlab.com/mitsos1os/job-board/-/pipelines)


## Tech Notes
 - The project is built using [**NestJS**](https://nestjs.com/) framework which is based on **Typescript**
 - [**TypeORM**](https://typeorm.io/#/) is used for modeling accessing to the database. Unfortunately,
   TypeORM does not support official PostgresQL functionality of SQL Compliant **IDENTITY** columns as Primary Auto Generated Table
   columns and uses the old **SERIAL** format which Postgres officially discourages:   https://wiki.postgresql.org/wiki/Don%27t_Do_This#Don.27t_use_serial
   On the other hand [**Sequelize**](https://sequelize.org/) **DOES** support it. A script could be integrated in production after setting up the tables
   to use RAW SQL for setting up the proper IDENTITY columns on the tables
 - The application is using **structured logging** through [**Winston**](https://github.com/winstonjs/winston) logger.
   When runnning the app in **development** mode, an easy to read console mode is used, however when running in
   **production** a structured JSON logging is used, suitable for parsing and sending to a central logging system
 - JWT Authentication has been applied to the application endpoints where suitable. For a more advanced case scenario,
ACL and Role Authorization should be applied where different permissions could be applied according to different roles.
 - For scaffolding a CRUD interface for the application entities, [**nestjsx/crud**](https://github.com/nestjsx/crud) was used.
  For all available filtering conditions, you can check their wiki out [here](https://github.com/nestjsx/crud/wiki/Requests#filter-conditions).
  So for example in order to search through jobs' titles you should issue the query 
  param: `filter=title||$contL||<SEARCH_TERM>` _(There are appropriate E2E tests for this)_
 - Currently the option to `synchronize` the database system upon application start is enabled. This is not recommended
   for production deployments and **controlled migrations** should be used in order to update the database system. This is left here for convenience