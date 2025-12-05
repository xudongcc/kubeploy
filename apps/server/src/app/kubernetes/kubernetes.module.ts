import { AppsV1Api, CoreV1Api, KubeConfig } from '@kubernetes/client-node';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: KubeConfig,
      useFactory: () => {
        const kubeConfig = new KubeConfig();
        kubeConfig.loadFromDefault();
        return kubeConfig;
      },
    },
    {
      provide: AppsV1Api,
      inject: [KubeConfig],
      useFactory: (kubeConfig: KubeConfig) => {
        return kubeConfig.makeApiClient(AppsV1Api);
      },
    },
    {
      provide: CoreV1Api,
      inject: [KubeConfig],
      useFactory: (kubeConfig: KubeConfig) => {
        return kubeConfig.makeApiClient(CoreV1Api);
      },
    },
  ],
  exports: [AppsV1Api, CoreV1Api],
})
export class KubernetesModule {}
