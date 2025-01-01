import { Controller, Get, HttpException, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '@app/modules/auth/auth.decorator';
import { PrismaService } from '@app/prisma.service';

@Public()
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private appService: AppService,
    private prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    this.logger.log('Hello World!');
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
