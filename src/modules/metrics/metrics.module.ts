import { Global, Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { metricsProviders } from '@app/modules/metrics/metrics.provider';

@Global()
@Module({
  imports: [PrometheusModule.register()],
  providers: [...metricsProviders],
  exports: [...metricsProviders], // 这里必须导出, 否则无法在其他模块中使用
})
export class MetricsModule {}
