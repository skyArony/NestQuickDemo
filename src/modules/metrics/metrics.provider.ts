import {
  makeCounterProvider,
  makeGaugeProvider,
  makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';

// 用于定义指标名的枚举
export enum Metrics {
  APP_VERSION = 'app_version',
  HTTP_REQUESTS_TOTAL = 'http_requests_total',
  HTTP_REQUEST_DURATION_SECONDS = 'http_request_duration_seconds',
}

export const metricsProviders = [
  makeGaugeProvider({
    name: Metrics.APP_VERSION,
    help: 'The current version of the application',
    labelNames: ['version'],
  }),

  makeCounterProvider({
    name: Metrics.HTTP_REQUESTS_TOTAL,
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'path', 'status'],
  }),

  makeHistogramProvider({
    name: Metrics.HTTP_REQUEST_DURATION_SECONDS,
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'path'],
    buckets: [100, 500, 1000, 2000, 5000], // milliseconds
  }),
];
