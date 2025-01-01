import { Controller, Get, HttpException, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '@app/modules/auth/auth.decorator';

@Public()
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

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
}
