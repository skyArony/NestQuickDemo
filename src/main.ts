import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import ResponseFormatInterceptor from './common/interceptors/response-format.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 注册全局拦截器
  app.useGlobalInterceptors(
    new ResponseFormatInterceptor(app.get(Reflector)), // 统一返回结构
  );

  // Swagger API 文档
  // 地址：http://localhost:3001/api
  // JSON：http://localhost:3001/api-json
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(3001);
}
bootstrap();
