import { registerEnumType } from '@nest-boot/graphql';

export enum ServiceStatus {
  // 等待中 / 尚未部署
  PENDING = 'PENDING',
  // 构建镜像中
  BUILDING = 'BUILDING',
  // 正在发布 / 滚动更新
  DEPLOYING = 'DEPLOYING',
  // 正常运行
  RUNNING = 'RUNNING',
  // 发布失败 / 无可用副本
  FAILED = 'FAILED',
  // 已停止（副本数为 0）
  STOPPED = 'STOPPED',
  // 无法判断
  UNKNOWN = 'UNKNOWN',
}

registerEnumType(ServiceStatus, {
  name: 'ServiceStatus',
});
