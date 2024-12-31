export default () => ({
  app: {
    name: process.env.APP_NAME || 'NestApp',
    version: process.env.APP_VERSION || '1.0.0',
    port: parseInt(process.env.APP_PORT, 10) || 3000,
  },
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'defaultSecret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  databaseConfig: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'myapp',
  },
  cache: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    ttl: parseInt(process.env.CACHE_TTL, 10) || 300,
  },
});
