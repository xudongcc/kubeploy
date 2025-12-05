import { CoreV1Api, V1Namespace } from '@kubernetes/client-node';
import { EntityData, EntityManager, RequiredEntityData } from '@mikro-orm/core';
import { EntityService, IdOrEntity } from '@nest-boot/mikro-orm';
import { Injectable } from '@nestjs/common';

import { configurationOptions, fieldManager } from '@/kubernetes';
import { Workspace } from '@/workspace/workspace.entity';

import { Project } from './project.entity';

export interface CreateProjectData {
  name: string;
  workspace: Workspace;
}

@Injectable()
export class ProjectService extends EntityService<Project> {
  constructor(
    protected readonly em: EntityManager,
    private readonly coreV1Api: CoreV1Api,
  ) {
    super(Project, em);
  }

  async create(data: RequiredEntityData<Project>): Promise<Project> {
    const project = await super.create(data);

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
    const namespaceBody = this.buildNamespace(project);

    await this.coreV1Api.patchNamespace(
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

    try {
      await this.coreV1Api.deleteNamespace({ name: project.kubeNamespaceName });
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
