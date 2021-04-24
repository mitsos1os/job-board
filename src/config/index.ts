import databaseConfig from './database.config';

export { validate } from './env.validation';
export default () => {
  // Get values from environment
  const {
    env: { PORT },
  } = process;
  return {
    port: PORT && parseInt(PORT, 10),
    database: databaseConfig(),
  };
};
