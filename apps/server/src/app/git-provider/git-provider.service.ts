import { EntityManager } from '@mikro-orm/core';
import { EntityService } from '@nest-boot/mikro-orm';
import { Injectable } from '@nestjs/common';

import { GitProviderAccount } from './entities/git-provider-account.entity';
import { GitProvider } from './entities/git-provider.entity';
import { GitProviderClientFactory } from './git-provider-client.factory';
import {
  GitBranch,
  GitRepository,
} from './interfaces/git-provider-driver.interface';

@Injectable()
export class GitProviderService extends EntityService<GitProvider> {
  constructor(
    protected readonly em: EntityManager,
    private readonly clientFactory: GitProviderClientFactory,
  ) {
    super(GitProvider, em);
  }

  /**
   * Get GitProviderAccount for a specific GitProvider and Workspace
   * Returns the first account found (one workspace can only have one account per provider)
   */
  async getAccount(
    workspaceId: string,
    gitProviderId: string,
  ): Promise<GitProviderAccount | null> {
    return await this.em.findOne(GitProviderAccount, {
      workspace: workspaceId,
      provider: gitProviderId,
    });
  }

  /**
   * Check if a workspace has authorized a specific GitProvider
   */
  async isAuthorized(
    workspaceId: string,
    gitProviderId: string,
  ): Promise<boolean> {
    const account = await this.getAccount(workspaceId, gitProviderId);
    return account !== null;
  }

  /**
   * List repositories for a given GitProvider and Workspace
   */
  async listRepositories(
    workspaceId: string,
    gitProviderId: string,
    page?: number,
    perPage?: number,
    search?: string,
  ): Promise<{ repositories: GitRepository[]; totalCount: number }> {
    const gitProvider = await this.findOneOrFail(gitProviderId);
    const account = await this.getAccount(workspaceId, gitProviderId);

    if (!account) {
      throw new Error('Not authorized');
    }

    const driver = this.clientFactory.getDriver(gitProvider, account.accessToken);
    return driver.listRepositories(page, perPage, search);
  }

  /**
   * List branches of a repository
   */
  async listBranches(
    workspaceId: string,
    gitProviderId: string,
    owner: string,
    repo: string,
  ): Promise<GitBranch[]> {
    const gitProvider = await this.findOneOrFail(gitProviderId);
    const account = await this.getAccount(workspaceId, gitProviderId);

    if (!account) {
      throw new Error('Not authorized');
    }

    const driver = this.clientFactory.getDriver(gitProvider, account.accessToken);
    return driver.listBranches(owner, repo);
  }
}
