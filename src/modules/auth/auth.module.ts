import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@app/modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Global()
@Module({
  imports: [
    UserModule,
    // 不异步注册会因为环境变量未来得及加载而报错
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: process.env['APP_NAME'] + process.env['PASSWORD_SUFFIX'],
        signOptions: { expiresIn: '36h' },
      }),
    }),
  ],
  providers: [
    AuthService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
