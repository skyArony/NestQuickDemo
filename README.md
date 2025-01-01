# 目前有的模块
- [x] `.env` 读取 & ConfigModule 全局配置模块
- [x] 统一错误处理模块
- [x] 统一返回格式模块
- [x] 基础日志使用示例
- [x] 请求记录打点
- [x] 用户模块
- [x] JWT模块 & 跳过鉴权装饰器
- [x] TypeORM 模块

# 项目结构
```
src/
├── app.module.ts       # 主模块文件
├── main.ts             # 应用入口文件
├── common/             # 通用模块和工具
│   ├── decorators/     # 自定义装饰器
│   ├── filters/        # 全局异常过滤器
│   ├── interceptors/   # 拦截器
│   ├── guards/         # 守卫
│   ├── pipes/          # 管道
│   ├── utils/          # 工具函数
├── config/             # 配置相关
│   ├── app.config.ts   # 应用配置
│   ├── database.config.ts # 数据库配置
├── modules/            # 功能模块
│   ├── users/          # 用户模块
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   ├── dto/        # 数据传输对象
│   │   ├── entities/   # 数据实体
│   ├── auth/           # 认证模块
│       ├── auth.controller.ts
│       ├── auth.service.ts
│       ├── auth.module.ts
│       ├── strategies/ # 策略（如 JWT 或 Local）
│       ├── guards/     # 模块级守卫
├── database/           # 数据库相关
│   ├── entities/       # 实体类（若使用 TypeORM 或 Prisma）
│   ├── migrations/     # 数据库迁移文件
│   ├── seeds/          # 数据库种子文件
├── interfaces/         # 公共接口
│   ├── user.interface.ts
│   ├── auth.interface.ts
├── middleware/         # 中间件
│   ├── logger.middleware.ts
├── tests/              # 测试文件夹
│   ├── e2e/            # 端到端测试
│   ├── unit/           # 单元测试
│   ├── mocks/          # 测试用的 Mock 数据
└── shared/             # 共享模块
    ├── cache/          # 缓存模块（如 Redis）
    ├── mailer/         # 邮件模块
    ├── logging/        # 日志模块
```

- 在 NestJS 社区和官方文档中，middleware 通常是单独管理的。这种实践为开发者提供了更加模块化和标准化的代码结构，尤其在大型项目中，有助于新开发者快速熟悉代码。
- 在一些项目中，modules/users/entities 和 database/entities 同时存在是为了平衡模块化和全局性需求, 模块中的实体可以通过 extends 或 组合 的方式扩展全局实体。例如：
    ```typescript
    // database/entities/user.entity.ts
    @Entity('users')
    export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    }

    // modules/users/entities/user.entity.ts
    import { UserEntity } from 'database/entities/user.entity';

    export class User extends UserEntity {
    // 模块特定字段或方法
    isActive: boolean;
    }
    ```

# 使用细节

## 配置
```typescript
// NODE_ENV 环境变量
Env.get()

// 其他配置
this.configSvc.get<string>('app.name')

// 非注入获取其他配置
appConfig().app.name

// 尽量不直接使用 process.env
```

## 判断环境
```typescript
Env.is(EnvType.DEVELOPMENT)
Env.isDev()
```

## 获取当前类名的日志实例
```typescript
private readonly logger = new Logger(this.constructor.name);
```