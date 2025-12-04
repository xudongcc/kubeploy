import { EntityManager } from '@mikro-orm/postgresql';
import { EntityService } from '@nest-boot/mikro-orm';
import { Injectable } from '@nestjs/common';

import { User } from '@/user/user.entity';
import { WorkspaceMemberRole } from '@/workspace-member/enums/workspace-member-role.enum';
import { WorkspaceMember } from '@/workspace-member/workspace-member.entity';

import { CreateWorkspaceInput } from './inputs/create-workspace.input';
import { Workspace } from './workspace.entity';

@Injectable()
export class WorkspaceService extends EntityService<Workspace> {
  constructor(protected readonly em: EntityManager) {
    super(Workspace, em);
  }

  async createWorkspace(
    user: User,
    input: CreateWorkspaceInput,
  ): Promise<Workspace> {
    const workspace = this.em.create(Workspace, {
      name: input.name,
    });

    // 创建 workspace 的同时创建一个 owner 成员
    const workspaceMember = this.em.create(WorkspaceMember, {
      workspace,
      user,
      name: user.name,
      role: WorkspaceMemberRole.OWNER,
    });

    await this.em.persistAndFlush([workspace, workspaceMember]);

    return workspace;
  }
}
