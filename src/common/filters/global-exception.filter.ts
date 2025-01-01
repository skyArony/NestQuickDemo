import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Response as Rsp } from '../interfaces/response.interface';

/**
 * 全局 Exception 捕获器
 *  - 无法捕获自身发生的错误
 *  - 无法捕获 unhandledRejection
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    // 判断异常类型, 使用不同的处理方式
    if (exception instanceof HttpException) {
      return this.httpExceptionHandler(exception, host);
    }

    // 兜底的异常处理
    return this.exceptionHandler(exception, host);
  }

  // 处理 HttpException
  httpExceptionHandler(exception: HttpException, host: ArgumentsHost) {
    // 获取上下文
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 获取异常信息
    const status = exception.getStatus();
    const message = exception.message;
    const stack = exception.stack;

    // 根据 Status 使用不同的错误级别
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`${exception.stack}`);
    } else if (status >= HttpStatus.BAD_REQUEST) {
      this.logger.warn(`${exception.stack}`);
    }

    // 如果怀疑 DDos 攻击, 可以打印更多信息
    // this.logger.debug(
    //   `DDos: ${request.method} ${status} ${request.ip} ${request.hostname} ${request.url} ${request.headers['user-agent']}`,
    // );

    const errRsp: Rsp = {
      code: status,
      message,
      error: stack, // TODO: 后面根据环境判断, 生产环境不返回 stack
      data: null,
    };

    response.status(status).json(errRsp);
  }

  // 处理其他异常
  exceptionHandler(exception: any, host: ArgumentsHost) {
    // 获取上下文
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 获取异常信息
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.message || null;
    const stack = exception.stack;

    this.logger.error(
      `${request.method} ${request.url} ${status} | ${exception.stack}`,
    );

    const errRsp: Rsp = {
      code: status,
      message,
      error: stack, // TODO: 后面根据环境判断, 生产环境不返回 stack
      data: null,
    };

    response.status(status).json(errRsp);
  }
}
