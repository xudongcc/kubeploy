import { CurrentUser } from '@nest-boot/auth';
import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nest-boot/graphql';
import { ConnectionManager } from '@nest-boot/graphql-connection';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

import { CurrentWorkspace } from '@/common/decorators/current-workspace.decorator';
import { CurrentWorkspaceMember } from '@/common/decorators/current-workspace-member.decorator';
import { Can, PermissionAction } from '@/lib/permission';
import { User } from '@/user/user.entity';
import { UserService } from '@/user/user.service';
import { Workspace } from '@/workspace/workspace.entity';

import { WorkspaceMemberRole } from './enums/workspace-member-role.enum';
import { AcceptWorkspaceInviteInput } from './inputs/accept-workspace-invite.input';
import { AddWorkspaceMemberInput } from './inputs/add-workspace-member.input';
import { CreateWorkspaceInviteInput } from './inputs/create-workspace-invite.input';
import { UpdateWorkspaceMemberInput } from './inputs/update-workspace-member.input';
import { AcceptWorkspaceInviteResult } from './types/accept-workspace-invite-result.type';
import {
  WorkspaceMemberConnection,
  WorkspaceMemberConnectionArgs,
} from './workspace-member.connection-definition';
import { WorkspaceMember } from './workspace-member.entity';
import { WorkspaceMemberService } from './workspace-member.service';

@Resolver(() => WorkspaceMember)
export class WorkspaceMemberResolver {
  constructor(
    private readonly workspaceMemberService: WorkspaceMemberService,
    private readonly userService: UserService,
    private readonly cm: ConnectionManager,
  ) {}

  @Can(PermissionAction.READ, WorkspaceMember)
  @Query(() => WorkspaceMember)
  currentWorkspaceMember(
    @CurrentWorkspaceMember() workspaceMember: WorkspaceMember,
  ): WorkspaceMember {
    return workspaceMember;
  }

  @Can(PermissionAction.READ, WorkspaceMember)
  @Query(() => WorkspaceMember, { nullable: true })
  async workspaceMember(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<WorkspaceMember | null> {
    return await this.workspaceMemberService.findOne({ id });
  }

  @Can(PermissionAction.READ, WorkspaceMember)
  @Query(() => WorkspaceMemberConnection)
  async workspaceMembers(
    @Args() args: WorkspaceMemberConnectionArgs,
    @CurrentWorkspace() workspace?: Workspace,
  ): Promise<WorkspaceMemberConnection> {
    if (workspace) {
      return await this.cm.find(WorkspaceMemberConnection, args, {
        where: {
          workspace,
        },
      });
    }

    return await this.cm.find(WorkspaceMemberConnection, args);
  }

  @Can(PermissionAction.READ, WorkspaceMember)
  @Query(() => WorkspaceMember, { nullable: true })
  async workspaceMemberByToken(
    @Args('token', { type: () => String }) token: string,
  ): Promise<WorkspaceMember | null> {
    return await this.workspaceMemberService.findOne({
      inviteToken: token,
    });
  }

  @Can(PermissionAction.CREATE, WorkspaceMember)
  @Mutation(() => WorkspaceMember)
  async addWorkspaceMember(
    @CurrentWorkspace() workspace: Workspace,
    @CurrentWorkspaceMember() workspaceMember: WorkspaceMember,
    @Args('input') input: AddWorkspaceMemberInput,
  ): Promise<WorkspaceMember> {
    // 只有所有者可以添加成员
    if (workspaceMember.role !== WorkspaceMemberRole.OWNER) {
      throw new ForbiddenException('You are not allowed to add members');
    }

    const user = await this.userService.findOne({
      email: input.email,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 检查新用户是否已经存在于当前工作空间
    const alreadyExist = await workspace.members.loadCount({
      where: {
        user: {
          id: user.id,
        },
      },
    });

    if (alreadyExist > 0) {
      throw new ForbiddenException('User already exists in the workspace');
    }

    return await this.workspaceMemberService.create({
      name: user.name ?? user.email.split('@')[0],
      user,
      workspace,
    });
  }

  @Can(PermissionAction.UPDATE, WorkspaceMember)
  @Mutation(() => WorkspaceMember, { nullable: true })
  async updateWorkspaceMember(
    @CurrentWorkspaceMember() currentWorkspaceMember: WorkspaceMember,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateWorkspaceMemberInput,
  ): Promise<WorkspaceMember | null> {
    // 普通用户不能修改其他成员的角色
    if (currentWorkspaceMember.role === WorkspaceMemberRole.MEMBER) {
      throw new ForbiddenException('You are not allowed to update members');
    }

    const member = await this.workspaceMemberService.findOneOrFail({
      id,
    });

    // 不能修改角色为所有者的成员
    if (
      member.id !== currentWorkspaceMember.id &&
      member.role === WorkspaceMemberRole.OWNER
    ) {
      throw new ForbiddenException(
        'You are not allowed to update other members',
      );
    }

    return await this.workspaceMemberService.updateWorkspaceMember(
      member,
      input,
    );
  }

  @Can(PermissionAction.DELETE, WorkspaceMember)
  @Mutation(() => WorkspaceMember)
  async removeWorkspaceMember(
    @CurrentWorkspaceMember() workspaceMember: WorkspaceMember,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<WorkspaceMember> {
    if (workspaceMember.role !== WorkspaceMemberRole.OWNER) {
      throw new ForbiddenException('You are not allowed to remove members');
    }

    const member = await this.workspaceMemberService.findOneOrFail({ id });

    if (member.id === workspaceMember.id) {
      throw new ForbiddenException('You are not allowed to remove yourself');
    }

    return await this.workspaceMemberService.remove(member);
  }

  @Can(PermissionAction.CREATE, WorkspaceMember)
  @Mutation(() => WorkspaceMember)
  async createWorkspaceInvite(
    @CurrentWorkspace() currentWorkspace: Workspace,
    @CurrentWorkspaceMember() currentWorkspaceMember: WorkspaceMember,
    @Args('input') input: CreateWorkspaceInviteInput,
  ): Promise<WorkspaceMember> {
    // 只有管理员和所有者可以创建邀请
    if (
      ![WorkspaceMemberRole.ADMIN, WorkspaceMemberRole.OWNER].includes(
        currentWorkspaceMember.role,
      )
    ) {
      throw new ForbiddenException('You are not allowed to create invites');
    }

    return await this.workspaceMemberService.createWorkspaceInvite(
      currentWorkspaceMember,
      currentWorkspace,
      input,
    );
  }

  @Can(PermissionAction.UPDATE, WorkspaceMember)
  @Mutation(() => AcceptWorkspaceInviteResult)
  async acceptWorkspaceInvite(
    @Args('token', { type: () => String }) token: string,
    @Args('input', { type: () => AcceptWorkspaceInviteInput, nullable: true })
    input: AcceptWorkspaceInviteInput | null,
    @CurrentUser() currentUser: User,
  ): Promise<AcceptWorkspaceInviteResult> {
    // 查找待接受的邀请
    const member = await this.workspaceMemberService.findOne({
      inviteToken: token,
    });

    if (!member) {
      throw new NotFoundException('邀请链接无效或已过期');
    }

    return await this.workspaceMemberService.acceptWorkspaceInvite(
      currentUser,
      member,
      input,
    );
  }

  @Can(PermissionAction.READ, User)
  @ResolveField(() => User, { nullable: true })
  async user(@Parent() workspaceMember: WorkspaceMember) {
    if (!workspaceMember.user?.id) {
      return null;
    }

    return (await workspaceMember.user.loadOrFail()) ?? null;
  }

  @Can(PermissionAction.READ, User)
  @ResolveField(() => User, { nullable: true })
  async invitedBy(@Parent() workspaceMember: WorkspaceMember) {
    if (!workspaceMember.invitedBy?.id) {
      return null;
    }

    try {
      const user = await workspaceMember.invitedBy.loadOrFail();
      // 如果 user 存在但 name 为 null，返回 null，让前端使用 invitedByUserName
      if (!user.name) {
        return null;
      }
      return user;
    } catch {
      return null;
    }
  }
}
