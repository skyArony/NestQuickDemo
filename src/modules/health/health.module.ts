import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    TerminusModule.forRoot({
      gracefulShutdownTimeoutMs: 10_000, // 优雅关闭超时时间 10s
    }),
  ],
  controllers: [HealthController],
})
export class HealthModule {}
