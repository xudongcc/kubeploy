import { V1Ingress } from '@kubernetes/client-node';
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

import { Domain } from './domain.entity';

@Injectable()
export class DomainService extends EntityService<Domain> {
  constructor(
    protected readonly em: EntityManager,
    private readonly clusterClientFactory: ClusterClientFactory,
    private readonly serviceService: ServiceService,
  ) {
    super(Domain, em);
  }

  async createDomain(
    data: Omit<CreateEntityData<Domain>, 'workspace'>,
  ): Promise<Domain> {
    const service = await this.serviceService.findOneOrFail(data.service);
    const workspace = await service.workspace.loadOrFail();

    const domain = await super.create({
      ...data,
      service,
      workspace,
    });

    await this.sync(domain);

    return domain;
  }

  async update(
    idOrEntity: IdOrEntity<Domain>,
    data: EntityData<Domain>,
  ): Promise<Domain> {
    const domain = await super.update(idOrEntity, data);

    await this.sync(domain);

    return domain;
  }

  async sync(domain: Domain): Promise<void> {
    const service = await domain.service.loadOrFail();
    const project = await service.project.loadOrFail();
    const cluster = await project.cluster.loadOrFail();
    const namespace = project.kubeNamespaceName;

    const networkingV1Api = this.clusterClientFactory.getNetworkingV1Api(cluster);
    const ingressBody = this.buildIngress(domain, service);

    await networkingV1Api.patchNamespacedIngress(
      {
        name: domain.kubeIngressName,
        namespace,
        body: ingressBody,
        fieldManager,
        force: true,
      },
      configurationOptions,
    );
  }

  async remove(idOrEntity: IdOrEntity<Domain>): Promise<Domain> {
    const domain = await this.findOneOrFail(idOrEntity);

    const service = await domain.service.loadOrFail();
    const project = await service.project.loadOrFail();
    const cluster = await project.cluster.loadOrFail();
    const namespace = project.kubeNamespaceName;

    const networkingV1Api = this.clusterClientFactory.getNetworkingV1Api(cluster);

    try {
      await networkingV1Api.deleteNamespacedIngress({
        name: domain.kubeIngressName,
        namespace,
      });
    } catch (error: unknown) {
      if (!isNotFoundError(error)) {
        throw error;
      }
    }

    return await super.remove(domain);
  }

  private buildIngress(
    domain: Domain,
    service: { kubeServiceName: string; id: string; project: { id: string } },
  ): V1Ingress {
    return {
      apiVersion: 'networking.k8s.io/v1',
      kind: 'Ingress',
      metadata: {
        name: domain.kubeIngressName,
        labels: {
          'managed-by': 'kubeploy',
          'kubeploy.com/domain-id': domain.id,
          'kubeploy.com/service-id': service.id,
          'kubeploy.com/project-id': service.project.id,
        },
      },
      spec: {
        rules: [
          {
            host: domain.host,
            http: {
              paths: [
                {
                  path: domain.path,
                  pathType: 'Prefix',
                  backend: {
                    service: {
                      name: service.kubeServiceName,
                      port: {
                        number: domain.servicePort,
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    };
  }
}
