import {
  AppsV1Api,
  CoreV1Api,
  PatchStrategy,
  setHeaderOptions,
  V1Deployment,
  V1Service,
} from '@kubernetes/client-node';
import { EntityData, EntityManager } from '@mikro-orm/core';
import { EntityService, IdOrEntity } from '@nest-boot/mikro-orm';
import { Injectable } from '@nestjs/common';

import { CreateEntityData } from '@/common/types/create-entity-data.type';
import { ProjectService } from '@/project/project.service';

import { Service } from './service.entity';

const FIELD_MANAGER = 'kubeploy';
const SERVER_SIDE_APPLY_OPTIONS = setHeaderOptions(
  'Content-Type',
  PatchStrategy.ServerSideApply,
);

@Injectable()
export class ServiceService extends EntityService<Service> {
  constructor(
    protected readonly em: EntityManager,
    private readonly appsV1Api: AppsV1Api,
    private readonly coreV1Api: CoreV1Api,
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
    const namespace = project.kubeNamespaceName;

    const deploymentBody = this.buildDeployment(service);
    const serviceBody = this.buildService(service);

    // Apply Deployment using Server-Side Apply
    await this.appsV1Api.patchNamespacedDeployment(
      {
        name: service.kubeDeploymentName,
        namespace,
        body: deploymentBody,
        fieldManager: FIELD_MANAGER,
        force: true,
      },
      SERVER_SIDE_APPLY_OPTIONS,
    );

    // Sync Service (only if ports are defined)
    if (service.ports.length > 0) {
      // Apply Service using Server-Side Apply
      await this.coreV1Api.patchNamespacedService(
        {
          name: service.kubeServiceName,
          namespace,
          body: serviceBody,
          fieldManager: FIELD_MANAGER,
          force: true,
        },
        SERVER_SIDE_APPLY_OPTIONS,
      );
    } else {
      // Delete service if no ports are defined
      try {
        await this.coreV1Api.deleteNamespacedService({
          name: service.kubeServiceName,
          namespace,
        });
      } catch (error: unknown) {
        if (!this.isNotFoundError(error)) {
          throw error;
        }
      }
    }
  }

  async remove(idOrEntity: IdOrEntity<Service>): Promise<Service> {
    const service = await this.findOneOrFail(idOrEntity);

    const project = await service.project.loadOrFail();
    const namespace = project.kubeNamespaceName;

    try {
      await this.appsV1Api.deleteNamespacedDeployment({
        name: service.kubeDeploymentName,
        namespace,
      });
    } catch (error: unknown) {
      if (!this.isNotFoundError(error)) {
        throw error;
      }
    }

    try {
      await this.coreV1Api.deleteNamespacedService({
        name: service.kubeServiceName,
        namespace,
      });
    } catch (error: unknown) {
      if (!this.isNotFoundError(error)) {
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

  private isNotFoundError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as { response: unknown }).response === 'object' &&
      (error as { response: { statusCode?: number } }).response?.statusCode ===
        404
    );
  }
}
