import { V1Deployment, V1Secret, V1Service } from '@kubernetes/client-node';
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

import { ServicePortProtocol } from './enums/service-port-protocol.enum';
import { ServiceStatus } from './enums/service-status.enum';
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

    return await super.create({
      ...data,
      project: project,
      workspace: project.workspace,
    });
  }

  async update(
    idOrEntity: IdOrEntity<Service>,
    data: Omit<EntityData<Service>, 'workspace'>,
  ): Promise<Service> {
    return await super.update(idOrEntity, data);
  }

  async deploy(idOrEntity: IdOrEntity<Service>): Promise<Service> {
    const service = await this.findOneOrFail(idOrEntity);

    const project = await service.project.loadOrFail();
    const cluster = await project.cluster.loadOrFail();
    const namespace = project.kubeNamespaceName;

    const appsV1Api = this.clusterClientFactory.getAppsV1Api(cluster);
    const coreV1Api = this.clusterClientFactory.getCoreV1Api(cluster);

    const deploymentBody = await this.buildDeployment(service);
    const serviceBody = this.buildService(service);
    const secretBody = this.buildRegistryCredentialSecret(service);

    // Sync registry credential secret
    if (secretBody) {
      await coreV1Api.patchNamespacedSecret(
        {
          name: service.kubeRegistryCredentialSecretName,
          namespace,
          body: secretBody,
          fieldManager,
          force: true,
        },
        configurationOptions,
      );
    } else {
      // Delete secret if no credentials are provided
      try {
        await coreV1Api.deleteNamespacedSecret({
          name: service.kubeRegistryCredentialSecretName,
          namespace,
        });
      } catch (error: unknown) {
        if (!isNotFoundError(error)) {
          throw error;
        }
      }
    }

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

    return service;
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

    try {
      await coreV1Api.deleteNamespacedSecret({
        name: service.kubeRegistryCredentialSecretName,
        namespace,
      });
    } catch (error: unknown) {
      if (!isNotFoundError(error)) {
        throw error;
      }
    }

    return await super.remove(service);
  }

  private buildImageString(image: Service['image']): string {
    if (!image.name) {
      throw new Error('Image name is required');
    }

    let imageString = '';

    if (image.registry) {
      imageString += `${image.registry}/`;
    }

    imageString += image.name;

    if (image.digest) {
      imageString += `@${image.digest}`;
    } else if (image.tag) {
      imageString += `:${image.tag}`;
    }

    return imageString;
  }

  private async buildDeployment(service: Service): Promise<V1Deployment> {
    const volumes = await service.volumes.loadItems();
    const imageString = this.buildImageString(service.image);

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
        replicas: 1,
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
                image: imageString,
                ports:
                  service.ports.length > 0
                    ? service.ports.map((p) => ({
                        protocol:
                          p.protocol === ServicePortProtocol.HTTP
                            ? 'TCP'
                            : p.protocol,
                        name: `port-${p.port}`,
                        containerPort: p.port,
                      }))
                    : undefined,
                env:
                  service.environmentVariables.length > 0
                    ? service.environmentVariables.map((env) => ({
                        name: env.key,
                        value: env.value,
                      }))
                    : undefined,
                volumeMounts: volumes
                  .map((volume) => {
                    if (!volume.mountPath) {
                      return null;
                    }

                    return {
                      name: volume.kubePersistentVolumeClaimName,
                      mountPath: volume.mountPath,
                    };
                  })
                  .filter((volume) => volume !== null),
              },
            ],
            imagePullSecrets:
              service.image.username && service.image.password
                ? [{ name: service.kubeRegistryCredentialSecretName }]
                : undefined,
            volumes: volumes.map((volume) => ({
              name: volume.kubePersistentVolumeClaimName,
              persistentVolumeClaim: {
                claimName: volume.kubePersistentVolumeClaimName,
              },
            })),
          },
        },
      },
    };
  }

  private buildRegistryCredentialSecret(service: Service): V1Secret | null {
    const { image } = service;

    // Only create secret if username and password are provided
    if (!image.username || !image.password) {
      return null;
    }

    const registry = image.registry ?? 'https://index.docker.io/v1/';
    const auth = Buffer.from(`${image.username}:${image.password}`).toString(
      'base64',
    );

    const dockerConfigJson = JSON.stringify({
      auths: {
        [registry]: {
          username: image.username,
          password: image.password,
          auth,
        },
      },
    });

    return {
      apiVersion: 'v1',
      kind: 'Secret',
      metadata: {
        name: service.kubeRegistryCredentialSecretName,
        labels: {
          'managed-by': 'kubeploy',
          'kubeploy.com/service-id': service.id,
          'kubeploy.com/project-id': service.project.id,
        },
      },
      type: 'kubernetes.io/dockerconfigjson',
      data: {
        '.dockerconfigjson': Buffer.from(dockerConfigJson).toString('base64'),
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
        ports: service.ports.map((p) => ({
          name: `port-${p.port}`,
          port: p.port,
          targetPort: p.port,
        })),
      },
    };
  }

  async getStatus(service: Service): Promise<ServiceStatus> {
    const project = await service.project.loadOrFail();
    const cluster = await project.cluster.loadOrFail();
    const namespace = project.kubeNamespaceName;

    const appsV1Api = this.clusterClientFactory.getAppsV1Api(cluster);

    try {
      const deployment = await appsV1Api.readNamespacedDeployment({
        name: service.kubeDeploymentName,
        namespace,
      });

      const spec = deployment.spec;
      const status = deployment.status;

      if (!spec || !status) {
        return ServiceStatus.UNKNOWN;
      }

      const desiredReplicas = spec.replicas ?? 0;
      const readyReplicas = status.readyReplicas ?? 0;
      const updatedReplicas = status.updatedReplicas ?? 0;
      const availableReplicas = status.availableReplicas ?? 0;
      const unavailableReplicas = status.unavailableReplicas ?? 0;

      // 副本数为 0，已停止
      if (desiredReplicas === 0) {
        return ServiceStatus.STOPPED;
      }

      // 检查是否有失败的条件
      const conditions = status.conditions ?? [];
      const progressingCondition = conditions.find(
        (c: { type?: string }) => c.type === 'Progressing',
      );
      const availableCondition = conditions.find(
        (c: { type?: string }) => c.type === 'Available',
      );

      // 如果 Progressing 条件为 False 且原因是 ProgressDeadlineExceeded，则部署失败
      if (
        progressingCondition?.status === 'False' &&
        progressingCondition?.reason === 'ProgressDeadlineExceeded'
      ) {
        return ServiceStatus.FAILED;
      }

      // 正在滚动更新
      if (updatedReplicas < desiredReplicas || unavailableReplicas > 0) {
        return ServiceStatus.DEPLOYING;
      }

      // 所有副本都已就绪
      if (
        readyReplicas === desiredReplicas &&
        availableReplicas === desiredReplicas &&
        availableCondition?.status === 'True'
      ) {
        return ServiceStatus.RUNNING;
      }

      // 部分副本未就绪，可能正在部署
      if (readyReplicas < desiredReplicas) {
        return ServiceStatus.DEPLOYING;
      }

      return ServiceStatus.RUNNING;
    } catch (error: unknown) {
      if (isNotFoundError(error)) {
        // Deployment 不存在，返回待部署状态
        return ServiceStatus.PENDING;
      }
      // 其他错误，返回未知状态
      return ServiceStatus.UNKNOWN;
    }
  }
}
