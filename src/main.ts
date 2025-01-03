import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import ResponseFormatInterceptor from './common/interceptors/response-format.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from '@app/common/filters/global-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 注册全局异常过滤器
  app.useGlobalFilters(new GlobalExceptionFilter());

  // 全局响应拦截器, 统一响应格式
  app.useGlobalInterceptors(
    new ResponseFormatInterceptor(app.get(Reflector)), // 统一返回结构
  );

  // 启用全局验证管道, 对请求参数进行验证, 依赖 class-validator 和 class-transformer
  // transform 自动转化为 DTO 定义的类型, 比如 "26" => 26, "2021-01-01" => Date
  // whitelist 严格模式, 只允许 DTO 中定义的字段进入, 其他字段会被过滤掉
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
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

  // 这里使用外部 Nginx 反向代理, 就不需要监听 443 端口了
  // 监听 443 端口, 提供 HTTPS 服务
  // const rootDir = process.cwd();
  // const keyPath = IsDev()
  //   ? join(rootDir, 'assets', 'cert', 'site', 'private-key.pem')
  //   : '/app/ssl/privkey.pem';
  // const certPath = IsDev()
  //   ? join(rootDir, 'assets', 'cert', 'site', 'public-certificate.pem')
  //   : '/app/ssl/fullchain.pem';
  // const httpsOptions = {
  //   key: readFileSync(keyPath),
  //   cert: readFileSync(certPath),
  // };
  // const httpsServer = https.createServer(
  //   httpsOptions,
  //   app.getHttpAdapter().getInstance(),
  // );
  // httpsServer.listen(IsDev() ? 4430 : 443);

  await app.listen(3001);
}
bootstrap();

// 为了利用多核心 CPU, 创建多个工作进程
// 结合 PM2 的 -i 参数使用: pm2 start dist/main.js -i max
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const cluster = require('cluster');
// const logger = new Logger('Cluster');
// if (cluster.isPrimary) {
//   // 获取 CPU 核心数
//   const numCPUs = os.cpus().length;

//   // 记录主进程启动信息
//   logger.log(`主进程 ${process.pid} 正在运行`);
//   logger.log(`启动 ${numCPUs} 个工作进程...`);

//   // 为每个 CPU 创建一个工作进程
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   // 监听工作进程退出事件
//   cluster.on('exit', (worker, code, signal) => {
//     logger.log(`工作进程 ${worker.process.pid} 已退出`);
//     // 如果进程意外退出，重新启动一个新的工作进程
//     if (code !== 0 && !worker.exitedAfterDisconnect) {
//       logger.log(`工作进程崩溃，正在启动新的工作进程...`);
//       cluster.fork();
//     }
//   });

//   // 优雅关闭处理
//   process.on('SIGTERM', async () => {
//     logger.log('收到 SIGTERM 信号，开始优雅关闭...');
//     for (const id in cluster.workers) {
//       cluster.workers[id]?.kill();
//     }
//     process.exit(0);
//   });
// } else {
//   // 工作进程运行 NestJS 应用
//   logger.log(`工作进程 ${process.pid} 已启动`);
//   bootstrap();
// }
