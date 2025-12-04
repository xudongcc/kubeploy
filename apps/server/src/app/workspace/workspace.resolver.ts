import { CurrentUser } from '@nest-boot/auth';
import { Args, ID, Mutation, Query, Resolver } from '@nest-boot/graphql';
import { ConnectionManager } from '@nest-boot/graphql-connection';
import { ForbiddenException } from '@nestjs/common';

import { User } from '@/user/user.entity';
import { WorkspaceMemberRole } from '@/workspace-member/enums/workspace-member-role.enum';
import { WorkspaceMember } from '@/workspace-member/workspace-member.entity';
import { CurrentWorkspace } from '@/common/decorators/current-workspace.decorator';
import { CurrentWorkspaceMember } from '@/common/decorators/current-workspace-member.decorator';
import { Can, PermissionAction } from '@/lib/permission';

import { CreateWorkspaceInput } from './inputs/create-workspace.input';
import { UpdateWorkspaceInput } from './inputs/update-workspace.input';
import {
  WorkspaceConnection,
  WorkspaceConnectionArgs,
} from './workspace.connection-definition';
import { Workspace } from './workspace.entity';
import { WorkspaceService } from './workspace.service';

@Resolver(() => Workspace)
export class WorkspaceResolver {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly cm: ConnectionManager,
  ) {}

  @Can(PermissionAction.READ, Workspace)
  @Query(() => Workspace)
  currentWorkspace(@CurrentWorkspace() workspace: Workspace): Workspace {
    return workspace;
  }

  @Can(PermissionAction.READ, Workspace)
  @Query(() => Workspace, { nullable: true })
  async workspace(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<Workspace | null> {
    return await this.workspaceService.findOne({ id });
  }

  @Can(PermissionAction.READ, Workspace)
  @Query(() => WorkspaceConnection)
  async workspaces(
    @CurrentUser() user: User,
    @Args() args: WorkspaceConnectionArgs,
  ) {
    return await this.cm.find(WorkspaceConnection, args, {
      where: {
        members: {
          user,
        },
      },
    });
  }

  @Can(PermissionAction.CREATE, Workspace)
  @Mutation(() => Workspace)
  async createWorkspace(
    @CurrentUser() user: User,
    @Args('input') input: CreateWorkspaceInput,
  ): Promise<Workspace> {
    return await this.workspaceService.createWorkspace(user, input);
  }

  @Can(PermissionAction.UPDATE, Workspace)
  @Mutation(() => Workspace)
  async updateWorkspace(
    @CurrentWorkspace() workspace: Workspace,
    @CurrentWorkspaceMember() workspaceMember: WorkspaceMember,
    @Args('input') input: UpdateWorkspaceInput,
  ): Promise<Workspace> {
    if (
      ![WorkspaceMemberRole.ADMIN, WorkspaceMemberRole.OWNER].includes(
        workspaceMember.role,
      )
    ) {
      throw new ForbiddenException('Workspace member not admin or owner');
    }

    return await this.workspaceService.update(workspace, input);
  }

  @Can(PermissionAction.DELETE, Workspace)
  @Mutation(() => Workspace)
  async removeWorkspace(
    @CurrentWorkspace() workspace: Workspace,
    @CurrentWorkspaceMember() workspaceMember: WorkspaceMember,
  ): Promise<Workspace> {
    if (![WorkspaceMemberRole.OWNER].includes(workspaceMember.role)) {
      throw new ForbiddenException('Workspace member not admin or owner');
    }

    return await this.workspaceService.update(workspace, {
      deletedAt: new Date(),
    });
  }
}
