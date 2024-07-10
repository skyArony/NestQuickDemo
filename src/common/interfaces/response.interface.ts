import { HttpStatus } from '@nestjs/common';

/**
 * 通用响应结构
 */
export interface Response {
  code: HttpStatus;
  message: string | string[];
  error?: any;
  data: any;
}
