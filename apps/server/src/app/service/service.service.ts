import { V1Deployment, V1Service } from '@kubernetes/client-node';
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
import { ProjectService } from '@/project/project.service';

import { Service } from './service.entity';

@Injectable()
export class ServiceService extends EntityService<Service> {
  constructor(
    protected readonly em: EntityManager,
    private readonly clusterClientFactory: ClusterClientFactory,
    private readonly projectService: ProjectService,
  ) {
    super(Service, em);
  }

  async createService(
    data: Omit<CreateEntityData<Service>, 'workspace'>,
  ): Promise<Service> {
    const project = await this.projectService.findOneOrFail(data.project);

    const service = await super.create({
      ...data,
      project: project,
      workspace: project.workspace,
    });

    await this.sync(service);

    return service;
  }

  async update(
    idOrEntity: IdOrEntity<Service>,
    data: Omit<EntityData<Service>, 'workspace'>,
  ): Promise<Service> {
    const service = await super.update(idOrEntity, data);

    await this.sync(service);

    return service;
  }

  async sync(service: Service): Promise<void> {
    const project = await service.project.loadOrFail();
    const cluster = await project.cluster.loadOrFail();
    const namespace = project.kubeNamespaceName;

    const appsV1Api = this.clusterClientFactory.getAppsV1Api(cluster);
    const coreV1Api = this.clusterClientFactory.getCoreV1Api(cluster);

    const deploymentBody = this.buildDeployment(service);
    const serviceBody = this.buildService(service);

    // Apply Deployment using Server-Side Apply
    await appsV1Api.patchNamespacedDeployment(
      {
        name: service.kubeDeploymentName,
        namespace,
        body: deploymentBody,
        fieldManager,
        force: true,
      },
      configurationOptions,
    );

    // Sync Service (only if ports are defined)
    if (service.ports.length > 0) {
      // Apply Service using Server-Side Apply
      await coreV1Api.patchNamespacedService(
        {
          name: service.kubeServiceName,
          namespace,
          body: serviceBody,
          fieldManager,
          force: true,
        },
        configurationOptions,
      );
    } else {
      // Delete service if no ports are defined
      try {
        await coreV1Api.deleteNamespacedService({
          name: service.kubeServiceName,
          namespace,
        });
      } catch (error: unknown) {
        if (!isNotFoundError(error)) {
          throw error;
        }
      }
    }
  }

  async remove(idOrEntity: IdOrEntity<Service>): Promise<Service> {
    const service = await this.findOneOrFail(idOrEntity);

    const project = await service.project.loadOrFail();
    const cluster = await project.cluster.loadOrFail();
    const namespace = project.kubeNamespaceName;

    const appsV1Api = this.clusterClientFactory.getAppsV1Api(cluster);
    const coreV1Api = this.clusterClientFactory.getCoreV1Api(cluster);

    try {
      await appsV1Api.deleteNamespacedDeployment({
        name: service.kubeDeploymentName,
        namespace,
      });
    } catch (error: unknown) {
      if (!isNotFoundError(error)) {
        throw error;
      }
    }

    try {
      await coreV1Api.deleteNamespacedService({
        name: service.kubeServiceName,
        namespace,
      });
    } catch (error: unknown) {
      if (!isNotFoundError(error)) {
        throw error;
      }
    }

    return await super.remove(service);
  }

  private buildDeployment(service: Service): V1Deployment {
    return {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: service.kubeDeploymentName,
        labels: {
          'managed-by': 'kubeploy',
          'kubeploy.com/service-id': service.id,
          'kubeploy.com/project-id': service.project.id,
        },
      },
      spec: {
        replicas: service.replicas,
        selector: {
          matchLabels: {
            'kubeploy.com/service-id': service.id,
          },
        },
        template: {
          metadata: {
            labels: {
              'kubeploy.com/service-id': service.id,
            },
          },
          spec: {
            containers: [
              {
                name: 'main',
                image: service.image,
                ports:
                  service.ports.length > 0
                    ? service.ports.map((port) => ({
                        name: `port-${port}`,
                        containerPort: port,
                      }))
                    : undefined,
                env:
                  service.environmentVariables.length > 0
                    ? service.environmentVariables.map((env) => ({
                        name: env.key,
                        value: env.value,
                      }))
                    : undefined,
              },
            ],
          },
        },
      },
    };
  }

  private buildService(service: Service): V1Service {
    return {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {
        name: service.kubeServiceName,
        labels: {
          'managed-by': 'kubeploy',
          'kubeploy.com/service-id': service.id,
          'kubeploy.com/project-id': service.project.id,
        },
      },
      spec: {
        selector: {
          'kubeploy.com/service-id': service.id,
        },
        ports: service.ports.map((port) => ({
          name: `port-${port}`,
          port,
          targetPort: port,
        })),
      },
    };
  }
}
