import { Env } from '@app/common/utils/env.utils';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configSvc: ConfigService) {}

  getHello(): any {
    return {
      NODE_ENV: Env.get(),
      APP_NAME: this.configSvc.get<string>('app.name'),
      APP_VERSION: this.configSvc.get<string>('app.version'),
      LOG_LEVEL: this.configSvc.get<string>('logger.level'),
    };
  }
}
