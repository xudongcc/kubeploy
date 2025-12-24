import {
  V1Deployment,
  V1Probe,
  V1ResourceRequirements,
  V1Secret,
  V1Service,
} from '@kubernetes/client-node';
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

import { HealthCheckType } from './enums/health-check-type.enum';
import { ServicePortProtocol } from './enums/service-port-protocol.enum';
import { ServiceStatus } from './enums/service-status.enum';
import { ServiceMetrics } from './objects/service-metrics.object';
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
                resources: this.buildContainerResources(service),
                livenessProbe: this.buildLivenessProbe(service),
                readinessProbe: this.buildReadinessProbe(service),
                startupProbe: this.buildStartupProbe(service),
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

  private buildContainerResources(
    service: Service,
  ): V1ResourceRequirements | undefined {
    const { resourceLimits } = service;

    if (!resourceLimits.cpu && !resourceLimits.memory) {
      return undefined;
    }

    const resources: V1ResourceRequirements = {};

    if (resourceLimits.cpu || resourceLimits.memory) {
      resources.limits = {};
      resources.requests = {};

      if (resourceLimits.cpu) {
        // Convert millicores to Kubernetes format (e.g., 1000m = 1 core)
        resources.limits.cpu = `${resourceLimits.cpu}m`;
        // Request is half of the limit
        resources.requests.cpu = `${Math.floor(resourceLimits.cpu / 2)}m`;
      }

      if (resourceLimits.memory) {
        // Convert megabytes to Kubernetes format (e.g., 512Mi)
        resources.limits.memory = `${resourceLimits.memory}Mi`;
        // Request is half of the limit
        resources.requests.memory = `${Math.floor(resourceLimits.memory / 2)}Mi`;
      }
    }

    return resources;
  }

  private buildProbeAction(
    healthCheck: Service['healthCheck'],
  ): Partial<V1Probe> {
    if (!healthCheck) {
      return {};
    }

    if (healthCheck.type === HealthCheckType.HTTP) {
      return {
        httpGet: {
          path: healthCheck.path ?? '/',
          port: healthCheck.port,
        },
      };
    } else if (healthCheck.type === HealthCheckType.TCP) {
      return {
        tcpSocket: {
          port: healthCheck.port,
        },
      };
    }

    return {};
  }

  private buildStartupProbe(service: Service): V1Probe | undefined {
    const { healthCheck } = service;

    if (!healthCheck) {
      return undefined;
    }

    // Startup probe: more lenient, allows time for slow-starting containers
    // failureThreshold * periodSeconds = 30 * 10 = 300s (5 minutes) max startup time
    return {
      ...this.buildProbeAction(healthCheck),
      initialDelaySeconds: 0,
      timeoutSeconds: 3,
      periodSeconds: 10,
      successThreshold: 1,
      failureThreshold: 30,
    };
  }

  private buildLivenessProbe(service: Service): V1Probe | undefined {
    const { healthCheck } = service;

    if (!healthCheck) {
      return undefined;
    }

    // Liveness probe: checks if container is alive, restarts on failure
    return {
      ...this.buildProbeAction(healthCheck),
      initialDelaySeconds: 0,
      timeoutSeconds: 3,
      periodSeconds: 10,
      successThreshold: 1,
      failureThreshold: 3,
    };
  }

  private buildReadinessProbe(service: Service): V1Probe | undefined {
    const { healthCheck } = service;

    if (!healthCheck) {
      return undefined;
    }

    // Readiness probe: checks if container is ready to receive traffic
    return {
      ...this.buildProbeAction(healthCheck),
      initialDelaySeconds: 0,
      timeoutSeconds: 3,
      periodSeconds: 5,
      successThreshold: 1,
      failureThreshold: 3,
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

  async getMetrics(service: Service): Promise<ServiceMetrics> {
    const project = await service.project.loadOrFail();
    const cluster = await project.cluster.loadOrFail();
    const namespace = project.kubeNamespaceName;

    try {
      // Get pod metrics for this service using label selector
      const labelSelector = `kubeploy.com/service-id=${service.id}`;
      const podMetrics = await this.clusterClientFactory.getPodMetrics(
        cluster,
        namespace,
        labelSelector,
      );

      // Aggregate metrics from all pods/containers
      let totalUsedCpu = 0;
      let totalUsedMemory = 0;

      for (const metrics of podMetrics) {
        totalUsedCpu += this.parseCpuToMillicores(metrics.cpu);
        totalUsedMemory += this.parseMemoryToMB(metrics.memory);
      }

      return {
        usedCpu: Math.round(totalUsedCpu),
        usedMemory: Math.round(totalUsedMemory),
        limitCpu: service.resourceLimits.cpu,
        limitMemory: service.resourceLimits.memory,
      };
    } catch {
      // If metrics are not available, return zeros
      return {
        usedCpu: 0,
        usedMemory: 0,
        limitCpu: service.resourceLimits.cpu,
        limitMemory: service.resourceLimits.memory,
      };
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
