import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import ResponseFormatInterceptor from './common/interceptors/response-format.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 注册全局拦截器
  app.useGlobalInterceptors(
    new ResponseFormatInterceptor(app.get(Reflector)), // 统一返回结构
  );

  await app.listen(3001);
}
bootstrap();
