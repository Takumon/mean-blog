export const {
  SERVER_PORT = 3000,
  SECRET = 'blogAppServerSecret',
  TOKEN_EFFECTIVE_SECOND = 86400,
  MONGO_URL = 'mongodb://localhost:27017/test',
  MONGO_RETRY_INTERVAL = 20, // 単位は秒
  ROOT_USER_ID = 'root',
  ROOT_USER_PASSWORD = 'root',
  LIMIT_PER_PAGE = 20
} = process.env;
