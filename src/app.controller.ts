import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '@app/modules/auth/auth.decorator';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    this.logger.log('Hello World!');
    return this.appService.getHello();
  }
}