import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Metrics } from '@app/modules/metrics/metrics.provider';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  @InjectMetric(Metrics.HTTP_REQUESTS_TOTAL)
  private readonly http_requests_total: Counter;

  @InjectMetric(Metrics.HTTP_REQUEST_DURATION_SECONDS)
  private readonly http_request_duration_seconds: Histogram;

  use(req: Request, res: Response, next: NextFunction): void {
    const startTime = Date.now();
    const { method, path } = req;

    // 监听响应完成事件，记录请求成功情况
    res.on('finish', () => {
      this.http_requests_total.inc({
        method,
        path,
        status: res.statusCode,
      });

      this.http_request_duration_seconds.observe(
        { method, path },
        Date.now() - startTime,
      );
    });

    // 监听请求错误
    res.on('error', (error: any) => {
      this.http_requests_total.inc({
        method,
        path,
        status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });

      this.http_request_duration_seconds.observe(
        { method, path },
        Date.now() - startTime,
      );
    });

    next();
  }
}
