import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(this.constructor.name);

  use(req: Request, res: Response, next: NextFunction) {
    // 请求进入
    const { method, baseUrl } = req;
    const startTime = Date.now();

    // 请求完成
    res.on('finish', () => {
      const { statusCode, statusMessage } = res;
      const duration = Date.now() - startTime;
      const logText = `${method} ${statusCode} ${statusMessage} ${baseUrl} - ${duration}ms`;

      if (statusCode >= 500) {
        return this.logger.error(logText);
      }
      if (statusCode >= 400 && statusCode < 500) {
        return this.logger.warn(logText);
      }

      return this.logger.verbose(logText);
    });

    next();
  }
}
