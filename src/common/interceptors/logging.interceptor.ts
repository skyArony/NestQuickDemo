import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * 请求前后打点
 * 即使抛出异常, 也会执行, 而中间件无法做到这点
 */
@Injectable()
export default class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const now = Date.now();

    // 请求进入时打点
    this.logger.log(`${req.method} ${req.url}`);

    return next.handle().pipe(
      tap(() => {
        // 请求结束时打点
        this.logger.log(
          `${req.method} ${req.url} ${res.statusCode} ${Date.now() - now}ms`,
        );
      }),
    );
  }
}
