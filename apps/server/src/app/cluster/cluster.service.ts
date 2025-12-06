import { EntityData, EntityManager } from '@mikro-orm/core';
import { EntityService, IdOrEntity } from '@nest-boot/mikro-orm';
import { Injectable } from '@nestjs/common';

import { CreateEntityData } from '@/common/types/create-entity-data.type';
import { WorkspaceService } from '@/workspace/workspace.service';

import { Cluster } from './cluster.entity';

@Injectable()
export class ClusterService extends EntityService<Cluster> {
  constructor(
    protected readonly em: EntityManager,
    private readonly workspaceService: WorkspaceService,
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
}
