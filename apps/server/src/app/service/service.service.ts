import { AppsV1Api, CoreV1Api } from '@kubernetes/client-node';
import { EntityManager } from '@mikro-orm/core';
import { EntityService, IdOrEntity } from '@nest-boot/mikro-orm';
import { Injectable } from '@nestjs/common';

import { CreateEntityData } from '@/common/types/create-entity-data.type';
import { ProjectService } from '@/project/project.service';

import { Service } from './service.entity';

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

    await this.appsV1Api.createNamespacedDeployment({
      namespace: project.kubeNamespaceName,
      body: {
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
                  name: 'user-container',
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
      },
    });

    if (service.ports.length > 0) {
      await this.coreV1Api.createNamespacedService({
        namespace: project.kubeNamespaceName,
        body: {
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
              port,
              targetPort: port,
            })),
          },
        },
      });
    }

    return service;
  }

  async remove(idOrEntity: IdOrEntity<Service>): Promise<Service> {
    const service = await this.findOneOrFail(idOrEntity);

    const project = await service.project.loadOrFail();

    await this.appsV1Api.deleteNamespacedDeployment({
      name: service.kubeDeploymentName,
      namespace: project.kubeNamespaceName,
    });

    await this.coreV1Api.deleteNamespacedService({
      name: service.kubeServiceName,
      namespace: project.kubeNamespaceName,
    });

    return await super.remove(service);
  }
}
