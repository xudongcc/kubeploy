import { CoreV1Api } from '@kubernetes/client-node';
import { EntityManager, RequiredEntityData } from '@mikro-orm/core';
import { EntityService, IdOrEntity } from '@nest-boot/mikro-orm';
import { Injectable } from '@nestjs/common';

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

    await this.coreV1Api.createNamespace({
      body: {
        metadata: {
          name: `kp-${project.id}`,
          labels: {
            'managed-by': 'kubeploy',
            'kubeploy.com/project-id': project.id,
            'kubeploy.com/workspace-id': project.workspace.id,
          },
        },
      },
    });

    return project;
  }

  async remove(idOrEntity: IdOrEntity<Project>): Promise<Project> {
    const project = await this.findOneOrFail(idOrEntity);

    await this.coreV1Api.deleteNamespace({ name: `kp-${project.id}` });

    return await super.remove(project);
  }
}
