import databaseConfig from './database.config';

export default () => {
  // Get values from environment
  const {
    env: { PORT, JWT_SECRET },
  } = process;
  return {
    port: PORT && parseInt(PORT, 10),
    jwtSecret: JWT_SECRET,
    database: databaseConfig(),
  };
};
