import { EntityData, EntityManager } from '@mikro-orm/core';
import { EntityService, IdOrEntity } from '@nest-boot/mikro-orm';
import { Injectable } from '@nestjs/common';

import { CreateEntityData } from '@/common/types/create-entity-data.type';

import { Cluster } from './cluster.entity';
import { ClusterClientFactory } from './cluster-client.factory';
import { ClusterNodeStatus } from './enums/cluster-node-status.enum';
import { ClusterNode } from './objects/cluster-node.object';

@Injectable()
export class ClusterService extends EntityService<Cluster> {
  constructor(
    protected readonly em: EntityManager,
    private readonly clusterClientFactory: ClusterClientFactory,
  ) {
    super(Cluster, em);
  }

  async createCluster(data: CreateEntityData<Cluster>): Promise<Cluster> {
    return await super.create(data);
  }

  async update(
    idOrEntity: IdOrEntity<Cluster>,
    data: EntityData<Cluster>,
  ): Promise<Cluster> {
    return await super.update(idOrEntity, data);
  }

  async remove(idOrEntity: IdOrEntity<Cluster>): Promise<Cluster> {
    return await super.remove(idOrEntity);
  }

  async getNodes(cluster: Cluster): Promise<ClusterNode[]> {
    try {
      const coreV1Api = this.clusterClientFactory.getCoreV1Api(cluster);
      const { items: nodes } = await coreV1Api.listNode();

      // Fetch node metrics from metrics-server
      const nodeMetrics =
        await this.clusterClientFactory.getNodeMetrics(cluster);

      return nodes.map((node) => {
        const capacity = node.status?.capacity ?? {};
        const nodeName = node.metadata?.name ?? '';
        const metrics = nodeMetrics[nodeName];

        const internalAddress = node.status?.addresses?.find(
          (addr) => addr.type === 'InternalIP',
        );

        const readyCondition = node.status?.conditions?.find(
          (condition) => condition.type === 'Ready',
        );
        const status =
          readyCondition?.status === 'True'
            ? ClusterNodeStatus.ACTIVE
            : ClusterNodeStatus.UNKNOWN;

        return {
          id: node.metadata?.uid ?? '',
          name: nodeName,
          ip: internalAddress?.address ?? '',
          usedCpu: metrics ? this.parseCpuToMillicores(metrics.cpu) : 0,
          usedMemory: metrics ? this.parseMemoryToMB(metrics.memory) : 0,
          totalCpu: this.parseCpuToMillicores(capacity.cpu),
          totalMemory: this.parseMemoryToMB(capacity.memory),
          status,
        };
      });
    } catch {
      return [];
    }
  }

  /**
   * Parse CPU from Kubernetes format to millicores
   * Examples: "1" -> 1000, "500m" -> 500, "123456789n" -> 123.456789
   */
  private parseCpuToMillicores(cpu?: string): number {
    if (!cpu) return 0;

    // Handle nanocores (n) - used by metrics-server
    if (cpu.endsWith('n')) {
      const nanocores = parseFloat(cpu.slice(0, -1));
      return nanocores / 1000000; // Convert nanocores to millicores
    }

    // Handle millicores (m)
    if (cpu.endsWith('m')) {
      return parseFloat(cpu.slice(0, -1));
    }

    // Handle cores (no unit) - convert to millicores
    return parseFloat(cpu) * 1000;
  }

  /**
   * Parse memory from Kubernetes format to MB (megabytes)
   * Examples: "128Mi" -> 128, "1Gi" -> 1024, "512Ki" -> 0.5
   */
  private parseMemoryToMB(memory?: string): number {
    if (!memory) return 0;

    // Parse Kubernetes memory format with binary units (Ki, Mi, Gi, Ti)
    const units: Record<string, number> = {
      Ki: 1024, // 1 KiB = 1024 bytes
      Mi: 1024 ** 2, // 1 MiB = 1024^2 bytes
      Gi: 1024 ** 3, // 1 GiB = 1024^3 bytes
      Ti: 1024 ** 4, // 1 TiB = 1024^4 bytes
      Pi: 1024 ** 5, // 1 PiB = 1024^5 bytes
      Ei: 1024 ** 6, // 1 EiB = 1024^6 bytes
      K: 1000, // 1 KB = 1000 bytes (decimal)
      M: 1000 ** 2, // 1 MB = 1000^2 bytes
      G: 1000 ** 3, // 1 GB = 1000^3 bytes
      T: 1000 ** 4, // 1 TB = 1000^4 bytes
      P: 1000 ** 5, // 1 PB = 1000^5 bytes
      E: 1000 ** 6, // 1 EB = 1000^6 bytes
    };

    for (const [unit, multiplier] of Object.entries(units)) {
      if (memory.endsWith(unit)) {
        const value = parseFloat(memory.slice(0, -unit.length));
        const bytes = value * multiplier;
        return bytes / (1024 * 1024); // Convert to MB
      }
    }

    // No unit, assume bytes
    return parseFloat(memory) / (1024 * 1024);
  }

}
