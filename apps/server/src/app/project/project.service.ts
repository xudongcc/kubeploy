import { V1Namespace } from '@kubernetes/client-node';
import { EntityData, EntityManager } from '@mikro-orm/core';
import { EntityService, IdOrEntity } from '@nest-boot/mikro-orm';
import { Injectable } from '@nestjs/common';

import { ClusterService } from '@/cluster/cluster.service';
import { ClusterClientFactory } from '@/cluster/cluster-client.factory';
import { configurationOptions, fieldManager } from '@/kubernetes';

import { CreateProjectInput } from './inputs/create-project.input';
import { Project } from './project.entity';

@Injectable()
export class ProjectService extends EntityService<Project> {
  constructor(
    protected readonly em: EntityManager,
    private readonly clusterService: ClusterService,
    private readonly clusterClientFactory: ClusterClientFactory,
  ) {
    super(Project, em);
  }

  async createProject(input: CreateProjectInput): Promise<Project> {
    const cluster = await this.clusterService.findOneOrFail(input.clusterId);
    const workspace = await cluster.workspace.loadOrFail();

    const project = await super.create({
      name: input.name,
      cluster,
      workspace,
    });

    await this.sync(project);

    return project;
  }

  async update(
    idOrEntity: IdOrEntity<Project>,
    data: EntityData<Project>,
  ): Promise<Project> {
    const project = await super.update(idOrEntity, data);

    await this.sync(project);

    return project;
  }

  async sync(project: Project): Promise<void> {
    const cluster = await project.cluster.loadOrFail();
    const coreV1Api = this.clusterClientFactory.getCoreV1Api(cluster);
    const namespaceBody = this.buildNamespace(project);

    await coreV1Api.patchNamespace(
      {
        name: project.kubeNamespaceName,
        body: namespaceBody,
        fieldManager,
        force: true,
      },
      configurationOptions,
    );
  }

  async remove(idOrEntity: IdOrEntity<Project>): Promise<Project> {
    const project = await this.findOneOrFail(idOrEntity);
    const cluster = await project.cluster.loadOrFail();
    const coreV1Api = this.clusterClientFactory.getCoreV1Api(cluster);

    try {
      await coreV1Api.deleteNamespace({ name: project.kubeNamespaceName });
    } catch (error: unknown) {
      if (!this.isNotFoundError(error)) {
        throw error;
      }
    }

    return await super.remove(project);
  }

  private buildNamespace(project: Project): V1Namespace {
    return {
      apiVersion: 'v1',
      kind: 'Namespace',
      metadata: {
        name: project.kubeNamespaceName,
        labels: {
          'managed-by': 'kubeploy',
          'kubeploy.com/project-id': project.id,
          'kubeploy.com/workspace-id': project.workspace.id,
        },
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
