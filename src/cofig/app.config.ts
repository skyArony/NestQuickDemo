export const appConfig = {
  appName: process.env.APP_NAME || 'MyApp',
  version: process.env.APP_VERSION || '1.0.0',
  port: parseInt(process.env.APP_PORT, 10) || 3000,
};
