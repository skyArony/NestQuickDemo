import { Controller, Get, HttpException, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '@app/modules/auth/auth.decorator';
import { PrismaService } from '@app/modules/prisma/prisma.service';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Metrics } from '@app/modules/metrics/metrics.provider';
import { Gauge } from 'prom-client';

@Public()
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  @InjectMetric(Metrics.APP_VERSION)
  private readonly appVersion: Gauge;

  constructor(
    private appService: AppService,
    private prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    this.logger.log('Hello World!');
    this.appVersion.set(2);
    return this.appService.getHello();
  }

  @Get('test/:id')
  test(): string {
    throw new HttpException('Forbidden', 403);
    return 'test';
  }

  @Post('add')
  async add(): Promise<any> {
    return await this.prisma.user.create({
      data: {
        name: Date.now() + '@name',
      },
    });
  }
}
