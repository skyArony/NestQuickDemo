import * as fs from 'fs';
import * as path from 'path';

/**
 * 环境类型
 */
export enum EnvType {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  TEST = 'test',
}

/**
 * 环境变量静态工具类
 * 在不方便使用 ConfigService 的地方使用
 */
export class Env {
  /**
   * 尽量用这个方法, 不要用 this.configSvc.get<string>('NODE_ENV')
   * 保持统一
   */
  static get(): EnvType {
    return (process.env.NODE_ENV as EnvType) || EnvType.DEVELOPMENT;
  }

  static is(env: EnvType): boolean {
    return process.env.NODE_ENV === env;
  }

  static isProd(): boolean {
    return Env.is(EnvType.PRODUCTION);
  }

  static isDev(): boolean {
    return Env.is(EnvType.DEVELOPMENT);
  }

  static isTest(): boolean {
    return Env.is(EnvType.TEST);
  }

  /**
   * 返回 .env.* 文件路径
   * 优先级: .env.xxx > .env
   * .env 中全部是生产环境配置, .env.xxx 中是指定环境特有配置, 会覆盖 .env 中的配置
   */
  static dotEnvFile(): string[] {
    const baseEnv = path.resolve('.env');
    const envFiles = [baseEnv];

    // 检查基础 .env 文件
    if (!fs.existsSync(baseEnv)) {
      throw new Error('缺少环境配置文件: .env');
    }

    // 根据 NODE_ENV 加载特定的 .env 文件
    const specificEnv = path.resolve(`.env.${process.env.NODE_ENV}`);
    if (fs.existsSync(specificEnv)) {
      envFiles.unshift(specificEnv);
    }

    return envFiles;
  }
}
