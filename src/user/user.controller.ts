import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('user')
export class UserController {
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
