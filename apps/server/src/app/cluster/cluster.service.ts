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

      return nodes.map((node) => {
        const allocatable = node.status?.allocatable ?? {};
        const capacity = node.status?.capacity ?? {};

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
          name: node.metadata?.name ?? '',
          ip: internalAddress?.address ?? '',
          allocatableCpuCores: this.parseCpu(allocatable.cpu),
          allocatableMemoryBytes: this.parseMemory(allocatable.memory),
          allocatableDiskBytes: this.parseMemory(
            allocatable['ephemeral-storage'],
          ),
          capacityCpuCores: this.parseCpu(capacity.cpu),
          capacityMemoryBytes: this.parseMemory(capacity.memory),
          capacityDiskBytes: this.parseMemory(capacity['ephemeral-storage']),
          status,
        };
      });
    } catch {
      return [];
    }
  }

  private parseCpu(cpu?: string): number {
    if (!cpu) return 0;
    if (cpu.endsWith('m')) {
      return parseFloat(cpu.slice(0, -1)) / 1000;
    }
    return parseFloat(cpu);
  }

  private parseMemory(memory?: string): number {
    if (!memory) return 0;

    const units: Record<string, number> = {
      Ki: 1024,
      Mi: 1024 ** 2,
      Gi: 1024 ** 3,
      Ti: 1024 ** 4,
      Pi: 1024 ** 5,
      Ei: 1024 ** 6,
      K: 1000,
      M: 1000 ** 2,
      G: 1000 ** 3,
      T: 1000 ** 4,
      P: 1000 ** 5,
      E: 1000 ** 6,
    };

    for (const [unit, multiplier] of Object.entries(units)) {
      if (memory.endsWith(unit)) {
        return parseInt(memory.slice(0, -unit.length), 10) * multiplier;
      }
    }

    return parseInt(memory, 10);
  }
}
