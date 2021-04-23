import databaseConfig from './database.config';
/**
 * Default port used for app initialization
 */
const DEFAULT_PORT = 3000;

export default () => {
  // Get values from environment
  const {
    env: { PORT },
  } = process;
  return {
    port: (PORT && parseInt(PORT, 10)) || DEFAULT_PORT,
    database: databaseConfig(),
  };
};
