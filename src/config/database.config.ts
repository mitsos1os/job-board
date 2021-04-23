export default () => {
  const {
    env: { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS },
  } = process;
  const host = DB_HOST;
  const port = DB_PORT && parseInt(DB_PORT, 10);
  const dbName = DB_NAME;
  return {
    host,
    port,
    dbName,
    user: DB_USER,
    pass: DB_PASS,
  };
};
