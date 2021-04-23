const DEFAULT_DB_HOST = 'localhost';
const DEFAULT_DP_PORT = 5432;
const DEFAULT_DB_NAME = 'job-board';

export default () => {
  const {
    env: { DB_HOST, DB_PORT, DB_NAME },
  } = process;
  const host = DB_HOST || DEFAULT_DB_HOST;
  const port = (DB_PORT && parseInt(DB_PORT, 10)) || DEFAULT_DP_PORT;
  const dbName = DB_NAME || DEFAULT_DB_NAME;
  return { host, port, dbName };
};
