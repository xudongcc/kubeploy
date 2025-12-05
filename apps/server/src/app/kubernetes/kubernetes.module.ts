import { CoreV1Api, KubeConfig } from '@kubernetes/client-node';
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
      provide: CoreV1Api,
      inject: [KubeConfig],
      useFactory: (kubeConfig: KubeConfig) => {
        return kubeConfig.makeApiClient(CoreV1Api);
      },
    },
  ],
  exports: [CoreV1Api],
})
export class KubernetesModule {}
