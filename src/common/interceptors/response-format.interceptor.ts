import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IS_SKIP_RSP_FMT } from '../decorators/skip-rsp-fmt.decorator';
import { Request, Response } from 'express';
import { Response as RspDTO } from '../interfaces/response.interface';

/**
 * 响应格式化拦截器, 当前主要用于统一 http 响应格式
 */
@Injectable()
export default class ResponseFormatInterceptor implements NestInterceptor {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // 对于 @SkipRspFmt() 修饰的接口，直接放行
    const isSkipRspFmt = this.reflector.getAllAndOverride<boolean>(
      IS_SKIP_RSP_FMT,
      [context.getHandler(), context.getClass()],
    );
    if (isSkipRspFmt) {
      return next.handle();
    }

    const ctx = context.switchToHttp();
    const rsp = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const path = req.originalUrl || req.url; // 兼容处理

    // /metrics - Prometheus 监控指标
    // /health - 健康检查
    if (path.startsWith('/metrics') || path.startsWith('/health')) {
      return next.handle();
    }

    // 根据上下文类型，做不同的处理
    const ctxType = context.getType();
    switch (<string>ctxType) {
      case 'http':
        return next.handle().pipe(
          map((data) => {
            return {
              code: rsp.statusCode || HttpStatus.OK, // 状态码
              message: '成功',
              data,
            } as RspDTO;
          }),
        );
      default:
        this.logger.warn('不支持的上下文类型: ' + ctxType);
    }

    return next.handle().pipe(map((data) => data));
  }
}
