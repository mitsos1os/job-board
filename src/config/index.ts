import databaseConfig from './database.config';

export { default as validationSchema } from './validation.config';

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
