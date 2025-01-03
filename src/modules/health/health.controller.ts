import { PrismaService } from '@app/modules/prisma/prisma.service';
import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  DiskHealthIndicator,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaClient: PrismaService,
    private prisma: PrismaHealthIndicator,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    // private http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'), // HTTP 检查通常检查当前项目的外部 API 依赖
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          thresholdPercent: 0.9,
        }), // > 90% 磁盘使用率
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // > 150MB 堆内存使用
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024), // > 300MB 物理内存使用
      () => this.prisma.pingCheck('prisma', this.prismaClient), // Prisma 数据库连接检查
    ]);
  }
}
