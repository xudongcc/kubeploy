import { EntityManager } from '@mikro-orm/postgresql';
import { Logger } from '@nest-boot/logger';
import { EntityService } from '@nest-boot/mikro-orm';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import dayjs from 'dayjs';

import { User } from '../user/user.entity';
import { Workspace } from '../workspace/workspace.entity';
import { WorkspaceMemberInviteStatus } from './enums/invite-status.enum';
import { AcceptWorkspaceInviteInput } from './inputs/accept-workspace-invite.input';
import { CreateWorkspaceInviteInput } from './inputs/create-workspace-invite.input';
import { UpdateWorkspaceMemberInput } from './inputs/update-workspace-member.input';
import { AcceptWorkspaceInviteResult } from './types/accept-workspace-invite-result.type';
import { WorkspaceMember } from './workspace-member.entity';

@Injectable()
export class WorkspaceMemberService extends EntityService<WorkspaceMember> {
  constructor(
    protected readonly em: EntityManager,
    private readonly logger: Logger,
  ) {
    super(WorkspaceMember, em);
    this.logger.setContext(WorkspaceMemberService.name);
  }

  async createWorkspaceInvite(
    currentWorkspaceMember: WorkspaceMember,
    currentWorkspace: Workspace,
    input: CreateWorkspaceInviteInput,
  ): Promise<WorkspaceMember> {
    // 生成邀请 token
    const inviteToken = randomBytes(16).toString('hex');

    // 设置过期时间（7 天后）
    const inviteExpiresAt = dayjs().add(7, 'day').toDate();

    // 加载出邀请者信息
    const invitedBy = (await currentWorkspaceMember.user?.loadOrFail()) ?? null;

    if (!invitedBy) {
      throw new ForbiddenException('Invited by user not found');
    }

    // 创建邀请
    return await this.create({
      name: '待接受邀请',
      workspace: currentWorkspace,
      role: input.role,
      email: input.email ?? null,
      invitedBy,
      invitedByUserName: invitedBy.name,
      inviteToken,
      inviteExpiresAt,
      inviteStatus: WorkspaceMemberInviteStatus.PENDING,
      user: null,
    });
  }

  async acceptWorkspaceInvite(
    currentUser: User,
    member: WorkspaceMember,
    input: AcceptWorkspaceInviteInput | null = null,
  ): Promise<AcceptWorkspaceInviteResult> {
    // 检查是否过期
    if (member.inviteExpiresAt && member.inviteExpiresAt < new Date()) {
      // 更新状态为已过期
      await this.update(member, {
        inviteStatus: WorkspaceMemberInviteStatus.EXPIRED,
      });
      throw new BadRequestException('邀请链接已过期');
    }

    // 检查是否已经接受过
    if (member.inviteStatus === WorkspaceMemberInviteStatus.ACCEPTED) {
      throw new BadRequestException('已接受过邀请，此链接已失效');
    }
    // 检查用户是否已经是该工作空间的成员
    const existingMember = await this.findOne({
      user: currentUser,
      workspace: member.workspace,
    });

    if (existingMember) {
      throw new BadRequestException('您已经是该工作空间的成员');
    }

    // 如果邀请者设置了 email，需要核对用户的 email
    if (member.email) {
      if (currentUser.email !== member.email) {
        throw new BadRequestException(
          '邀请链接仅限指定的邮箱地址使用，请使用正确的邮箱账户接受邀请',
        );
      }
    }

    // 更新邀请状态，填充用户信息
    // 如果邀请者没有指定 email，使用用户的 email；如果已指定，保持邀请者指定的 email
    // 如果用户提供了 name，使用用户提供的；否则使用用户的默认 name
    const updatedMember = await this.update(member, {
      user: currentUser,
      name: input?.name ?? currentUser.name, // 如果用户提供了 name，使用用户提供的；否则使用用户的默认 name
      email: member.email ?? currentUser.email, // 如果邀请者已指定 email，保持；否则使用用户的 email
      inviteStatus: WorkspaceMemberInviteStatus.ACCEPTED,
      updatedAt: new Date(),
    });

    return {
      workspaceMember: updatedMember,
      workspaceId: updatedMember.workspace.id,
    };
  }

  async updateWorkspaceMember(
    member: WorkspaceMember,
    input: UpdateWorkspaceMemberInput,
  ): Promise<WorkspaceMember> {
    // 如果传入了邮箱，检查该工作空间下是否已经有其他成员使用了这个邮箱
    if (
      input.email !== undefined &&
      input.email !== null &&
      input.email !== ''
    ) {
      // 加载工作空间
      const workspace = await member.workspace.loadOrFail();

      // 查询该工作空间下是否有其他成员使用了这个邮箱
      const existingMembers = await this.em.find(WorkspaceMember, {
        email: input.email,
        workspace,
      });

      // 检查是否有其他成员（排除当前正在更新的成员）使用了这个邮箱
      const otherMember = existingMembers.find(
        (m: WorkspaceMember) => m.id !== member.id,
      );

      if (otherMember) {
        throw new BadRequestException('该工作空间下已存在使用此邮箱的成员');
      }
    }

    return await this.update(member, input);
  }
}
