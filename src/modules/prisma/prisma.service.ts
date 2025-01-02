import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(this.constructor.name);

  constructor() {
    // 定义扩展逻辑
    const loggingExtension = Prisma.defineExtension({
      query: {
        $allModels: {
          $allOperations: async ({ args, query, model, operation }) => {
            const start = Date.now();
            const result = await query(args); // 执行实际查询
            const duration = Date.now() - start;

            this.logger.verbose(`${model}.${operation} took ${duration}ms`);

            return result; // 返回查询结果
          },
        },
      },
    });

    // 创建扩展后的 Prisma Client
    const extendedClient = new PrismaClient().$extends(loggingExtension);

    // 将扩展功能注入到当前实例
    super();
    Object.assign(this, extendedClient);
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
