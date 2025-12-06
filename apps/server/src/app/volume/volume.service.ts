import { V1PersistentVolumeClaim } from '@kubernetes/client-node';
import { EntityData, EntityManager } from '@mikro-orm/core';
import { EntityService, IdOrEntity } from '@nest-boot/mikro-orm';
import { Injectable } from '@nestjs/common';

import { ClusterClientFactory } from '@/cluster/cluster-client.factory';
import { CreateEntityData } from '@/common/types/create-entity-data.type';
import {
  configurationOptions,
  fieldManager,
  isNotFoundError,
} from '@/kubernetes';
import { ServiceService } from '@/service/service.service';

import { Volume } from './volume.entity';

@Injectable()
export class VolumeService extends EntityService<Volume> {
  constructor(
    protected readonly em: EntityManager,
    private readonly clusterClientFactory: ClusterClientFactory,
    private readonly serviceService: ServiceService,
  ) {
    super(Volume, em);
  }

  async createVolume(
    data: Omit<CreateEntityData<Volume>, 'workspace'>,
  ): Promise<Volume> {
    const service = await this.serviceService.findOneOrFail(data.service);
    const workspace = await service.workspace.loadOrFail();

    const volume = await super.create({
      ...data,
      service,
      workspace,
    });

    await this.sync(volume);

    return volume;
  }

  async update(
    idOrEntity: IdOrEntity<Volume>,
    data: EntityData<Volume>,
  ): Promise<Volume> {
    const volume = await super.update(idOrEntity, data);

    await this.sync(volume);

    return volume;
  }

  async sync(volume: Volume): Promise<void> {
    const service = await volume.service.loadOrFail();
    const project = await service.project.loadOrFail();
    const cluster = await project.cluster.loadOrFail();
    const namespace = project.kubeNamespaceName;

    const coreV1Api = this.clusterClientFactory.getCoreV1Api(cluster);
    const pvcBody = this.buildPvc(volume);

    await coreV1Api.patchNamespacedPersistentVolumeClaim(
      {
        name: volume.kubePvcName,
        namespace,
        body: pvcBody,
        fieldManager,
        force: true,
      },
      configurationOptions,
    );
  }

  async remove(idOrEntity: IdOrEntity<Volume>): Promise<Volume> {
    const volume = await this.findOneOrFail(idOrEntity);

    const service = await volume.service.loadOrFail();
    const project = await service.project.loadOrFail();
    const cluster = await project.cluster.loadOrFail();
    const namespace = project.kubeNamespaceName;

    const coreV1Api = this.clusterClientFactory.getCoreV1Api(cluster);

    try {
      await coreV1Api.deleteNamespacedPersistentVolumeClaim({
        name: volume.kubePvcName,
        namespace,
      });
    } catch (error: unknown) {
      if (!isNotFoundError(error)) {
        throw error;
      }
    }

    return await super.remove(volume);
  }

  private buildPvc(volume: Volume): V1PersistentVolumeClaim {
    return {
      apiVersion: 'v1',
      kind: 'PersistentVolumeClaim',
      metadata: {
        name: volume.kubePvcName,
        labels: {
          'managed-by': 'kubeploy',
          'kubeploy.com/volume-id': volume.id,
          'kubeploy.com/service-id': volume.service.id,
        },
      },
      spec: {
        accessModes: ['ReadWriteOnce'],
        storageClassName: volume.storageClass,
        resources: {
          requests: {
            storage: volume.size,
          },
        },
      },
    };
  }
}
