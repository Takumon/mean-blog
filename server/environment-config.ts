
export const SERVER_PORT: string            = process.env.SERVER_PORT                    || '3000';
export const SECRET: string                 = process.env.SECRET                         || 'blogAppServerSecret';
export const TOKEN_EFFECTIVE_SECOND: number = Number(process.env.TOKEN_EFFECTIVE_SECOND) || 86400;
export const MONGO_URL: string              = process.env.MONGO_URL                      || 'mongodb://localhost:27017/test';
export const MONGO_RETRY_INTERVAL: number   = Number(process.env.MONGO_RETRY_INTERVAL)   || 20; // 単位は秒
export const ROOT_USER_ID: string           = process.env.ROOT_USER_ID                   || 'root';
export const ROOT_USER_PASSWORD: string     = process.env.ROOT_USER_PASSWORD             || 'root';
export const LIMIT_PER_PAGE: number         = Number(process.env.LIMIT_PER_PAGE)         || 20;
