import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Metrics } from '@app/modules/metrics/metrics.provider';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  @InjectMetric(Metrics.HTTP_REQUESTS_TOTAL)
  private readonly httpRequestsTotal: Counter;

  @InjectMetric(Metrics.HTTP_REQUEST_DURATION_SECONDS)
  private readonly httpRequestDurationSeconds: Histogram;

  use(req: Request, res: Response, next: NextFunction): void {
    const startTime = Date.now();
    const { method, path } = req;

    // 监听响应完成事件，记录请求成功情况
    res.on('finish', () => {
      this.httpRequestsTotal.inc({
        method,
        path,
        status: res.statusCode,
      });

      this.httpRequestDurationSeconds.observe(
        { method, path },
        Date.now() - startTime,
      );
    });

    // 监听请求错误
    res.on('error', (error: any) => {
      this.httpRequestsTotal.inc({
        method,
        path,
        status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });

      this.httpRequestDurationSeconds.observe(
        { method, path },
        Date.now() - startTime,
      );
    });

    next();
  }
}
