import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { Env } from '@app/common/utils/env.utils';
import appConfig from '@app/config/app.config';
import { LoggerMiddleware } from '@app/middleware/logger.middleware';
import { PrismaService } from '@app/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true, // 缓存环境变量, 提高性能
      envFilePath: Env.dotEnvFile(), // .env 文件路径
      load: [appConfig], // 动态加载配置
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: process.env['APP_NAME'] + process.env['PASSWORD_SUFFIX'],
      database: process.env['APP_NAME'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // 对所有路由生效
  }
}
