export default () => {
  const {
    env: { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS },
  } = process;
  const host = DB_HOST;
  const port = DB_PORT && parseInt(DB_PORT, 10);
  return {
    host,
    port,
    database: DB_NAME,
    username: DB_USER,
    password: DB_PASS,
  };
};
