import * as fs from 'fs';
import * as path from 'path';

export function GetDotEnvFile(): string[] {
  const commonEnv = path.resolve('.env');
  const devEnv = path.resolve('.env.development');

  // 通用 .env 必须存在
  if (!fs.existsSync(commonEnv)) {
    throw new Error('缺少环境配置文件: .env');
  }

  // 排在前面的优先级更高
  const envFilePath = [commonEnv];

  // 开发环境下, 优先使用 .env.development
  if (process.env['NODE_ENV'] === 'development') {
    envFilePath.unshift(devEnv);
  }

  return envFilePath;
}

export function IsDev(): boolean {
  if (!process.env['NODE_ENV']) {
    throw new Error('缺少环境变量: NODE_ENV');
  }

  return process.env['NODE_ENV'] === 'development';
}
