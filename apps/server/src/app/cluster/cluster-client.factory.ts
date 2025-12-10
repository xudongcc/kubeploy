import {
  AppsV1Api,
  CoreV1Api,
  KubeConfig,
  NetworkingV1Api,
} from '@kubernetes/client-node';
import { Injectable, Scope } from '@nestjs/common';
import axios from 'axios';
import https from 'https';

import { Cluster } from './cluster.entity';

@Injectable({ scope: Scope.REQUEST })
export class ClusterClientFactory {
  private readonly axios = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });

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
          skipTLSVerify: true,
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

  getKubeConfigPublic(cluster: Cluster): KubeConfig {
    return this.getKubeConfig(cluster);
  }

  async getNodeMetrics(
    cluster: Cluster,
  ): Promise<Record<string, { cpu: string; memory: string }>> {
    try {
      const response = await this.axios.get<{
        items: {
          metadata: { name: string };
          usage: { cpu: string; memory: string };
        }[];
      }>(`${cluster.server}/apis/metrics.k8s.io/v1beta1/nodes`, {
        headers: {
          Authorization: `Bearer ${cluster.token}`,
        },
      });

      return Object.fromEntries(
        response.data.items.map((item) => [item.metadata.name, item.usage]),
      );
    } catch {
      // If metrics-server is not available, return empty object
      return {};
    }
  }

  async getPodMetrics(
    cluster: Cluster,
    namespace: string,
    labelSelector?: string,
  ): Promise<{ cpu: string; memory: string }[]> {
    try {
      const params = new URLSearchParams();
      if (labelSelector) {
        params.append('labelSelector', labelSelector);
      }

      const url = `${cluster.server}/apis/metrics.k8s.io/v1beta1/namespaces/${namespace}/pods${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await this.axios.get<{
        items: {
          metadata: { name: string };
          containers: { name: string; usage: { cpu: string; memory: string } }[];
        }[];
      }>(url, {
        headers: {
          Authorization: `Bearer ${cluster.token}`,
        },
      });

      return response.data.items.flatMap((pod) =>
        pod.containers.map((container) => container.usage),
      );
    } catch {
      // If metrics-server is not available, return empty array
      return [];
    }
  }
}
