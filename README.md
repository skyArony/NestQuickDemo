# 目前有的模块

### 核心功能模块

- [x] `.env` 读取 & ConfigModule 全局配置模块
- [x] 统一错误处理模块
- [x] 统一返回格式模块
- [x] 基础日志使用示例
- [x] Cluster 多进程模块
- [ ] 本地文件日志 (还不确定是否必要)

### 常用功能模块

- [x] 请求记录打点
- [x] 用户模块
- [x] JWT模块 & 跳过鉴权装饰器
- [x] Prisma 模块
- [x] Swagger 模块
- [x] Metrics 模块
- [x] 健康检测 & 优雅关闭
- [x] 全局验证管道, 验证请求参数
- [x] RESTful Resource 示例

### 可选功能模块

- [x] TypeORM 模块
- [x] 暴露 HTTPS 端口

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
- `common/interceptors` 放的是那种具体模块无关的拦截器, 如果某个拦截器和模块强关联, 那么和模块放在一起, 例如 metrics 模块的拦截器。
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

## Prisma

```bash
# 初始化
pnpx prisma init

# 首次创建 schema.prisma 时
# DB -> schema.prisma
pnpx db pull

# 每次修改 schema.prisma 后
# schema.prisma -> Prisma Client
pnpx prisma generate

# 启动 Prisma Studio
pnpx prisma studio

# ================== 数据库迁移 ==================

# 开发模式下的迁移: 生成迁移文件并直接执行
#   --name: 指定迁移文件的名称。
#   --create-only: 只创建迁移文件，不应用迁移。
#   --dry-run: 模拟迁移，但不实际执行 SQL。
pnpx prisma migrate dev --name init

# 重置数据库
prisma migrate reset  # 清空数据库并重新应用迁移（会有交互式提示）
prisma migrate reset -f #  清空数据库并重新应用迁移 (不会提示)

# 生产环境下的迁移
# - 它会检查数据库中已应用的迁移，并应用所有尚未应用的迁移文件，将数据库更新到最新版本。
# - 非交互式，不会提示
#   --skip-generate: 跳过代码生成
prisma migrate deploy # 应用所有未应用的迁移
prisma migrate deploy --skip-generate # 跳过代码生成, 不重新生成 Prisma Client

# 查看迁移状态
# 用于查看当前数据库的迁移状态，包括已应用的迁移和未应用的迁移
prisma migrate status  # 显示迁移状态

# 解决迁移冲突 (危险操作)
# 当你手动修改数据库结构后，可能会导致迁移冲突，你可以使用 prisma migrate resolve 将迁移标记为已应用，即使它没有实际执行。
prisma migrate resolve --applied <migration_name>  # 标记 <migration_name> 为已应用

# 比较迁移状态
prisma migrate diff

# 手动创建迁移, 手动创建一个空的迁移文件
prisma migrate create
```

# 注意事项

### 中间件的注册影响 req 中的属性
>
> 参考 <https://github.com/nestjs/nest/issues/4315>

```bash
# 注册为
# consumer.apply(LoggerMiddleware).forRoutes('*'); // 对所有路由生效

# 请求 localhost:3001/app/test/1?a=1
console.log(req.originalUrl); # /app/test/1?a=1
console.log(req.baseUrl); # /app/test/1
console.log(req.url); # /?a=1
console.log(req.path); # /

# 是不太符合预期的
```

```bash
# 注册为
# consumer.apply(LoggerMiddleware).forRoutes('/'); // 对所有路由生效

# 请求 localhost:3001/app/test/1?a=1
console.log(req.originalUrl); # /app/test/1?a=1
console.log(req.baseUrl); # 空
console.log(req.url); # /app/test/1?a=1
console.log(req.path); # /app/test/1
```
