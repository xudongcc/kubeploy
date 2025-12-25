import { Parent, ResolveField, Resolver } from '@nest-boot/graphql';
import { NotFoundException } from '@nestjs/common';

import { WorkspaceMember } from '@/workspace-member/workspace-member.entity';
import { Workspace } from '@/workspace/workspace.entity';

import { GitProviderAuthorization } from '../entities/git-provider-authorization.entity';

@Resolver(() => GitProviderAuthorization)
export class GitProviderAuthorizationResolver {
  @ResolveField(() => Workspace)
  async workspace(
    @Parent() authorization: GitProviderAuthorization,
  ): Promise<Workspace> {
    const workspace = await authorization.workspace.load();

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return workspace;
  }

  @ResolveField(() => WorkspaceMember)
  async member(
    @Parent() authorization: GitProviderAuthorization,
  ): Promise<WorkspaceMember> {
    const member = await authorization.member.load();

    if (!member) {
      throw new NotFoundException('WorkspaceMember not found');
    }

    return member;
  }
}
