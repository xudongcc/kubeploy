import {
  AppsV1Api,
  CoreV1Api,
  KubeConfig,
  NetworkingV1Api,
} from '@kubernetes/client-node';
import { Injectable, Scope } from '@nestjs/common';

import { Cluster } from './cluster.entity';

@Injectable({ scope: Scope.REQUEST })
export class ClusterClientFactory {
  private configCache = new Map<string, KubeConfig>();

  private getKubeConfig(cluster: Cluster): KubeConfig {
    const cached = this.configCache.get(cluster.id);
    if (cached) {
      return cached;
    }

    const kubeConfig = new KubeConfig();

    kubeConfig.loadFromOptions({
      clusters: [
        {
          name: 'default',
          server: cluster.server,
          caData: cluster.certificateAuthorityData,
        },
      ],
      users: [
        {
          name: 'default',
          token: cluster.token,
        },
      ],
      contexts: [
        {
          name: 'default',
          cluster: 'default',
          user: 'default',
        },
      ],
      currentContext: 'default',
    });

    this.configCache.set(cluster.id, kubeConfig);

    return kubeConfig;
  }

  getCoreV1Api(cluster: Cluster): CoreV1Api {
    const kubeConfig = this.getKubeConfig(cluster);
    return kubeConfig.makeApiClient(CoreV1Api);
  }

  getAppsV1Api(cluster: Cluster): AppsV1Api {
    const kubeConfig = this.getKubeConfig(cluster);
    return kubeConfig.makeApiClient(AppsV1Api);
  }

  getNetworkingV1Api(cluster: Cluster): NetworkingV1Api {
    const kubeConfig = this.getKubeConfig(cluster);
    return kubeConfig.makeApiClient(NetworkingV1Api);
  }
}
