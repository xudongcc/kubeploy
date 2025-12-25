import { EntityManager } from '@mikro-orm/core';
import { EntityService } from '@nest-boot/mikro-orm';
import { Injectable } from '@nestjs/common';

import { GitProviderAuthorization } from '../entities/git-provider-authorization.entity';
import { GitProvider } from '../entities/git-provider.entity';
import { GitProviderClientFactory } from '../git-provider-client.factory';
import {
  GitBranch,
  GitRepository,
} from '../interfaces/git-provider-driver.interface';

@Injectable()
export class GitProviderService extends EntityService<GitProvider> {
  constructor(
    protected readonly em: EntityManager,
    private readonly clientFactory: GitProviderClientFactory,
  ) {
    super(GitProvider, em);
  }

  /**
   * Get GitProviderAuthorization for a specific GitProvider and Workspace
   */
  async getAuthorization(
    workspaceId: string,
    gitProviderId: string,
  ): Promise<GitProviderAuthorization | null> {
    return await this.em.findOne(
      GitProviderAuthorization,
      {
        workspace: workspaceId,
        account: {
          provider: gitProviderId,
        },
      },
      { populate: ['account'] },
    );
  }

  /**
   * Get repositories for a given GitProvider and Workspace
   */
  async getRepositories(
    workspaceId: string,
    gitProviderId: string,
    page?: number,
    perPage?: number,
    search?: string,
  ): Promise<{ repositories: GitRepository[]; totalCount: number }> {
    const gitProvider = await this.findOneOrFail(gitProviderId);
    const authorization = await this.getAuthorization(workspaceId, gitProviderId);

    if (!authorization) {
      throw new Error('Not authorized');
    }

    const account = authorization.account.getEntity();
    const driver = this.clientFactory.createDriver(gitProvider);
    return driver.getRepositories(account, page, perPage, search);
  }

  /**
   * Get branches of a repository
   */
  async getBranches(
    workspaceId: string,
    gitProviderId: string,
    owner: string,
    repo: string,
  ): Promise<GitBranch[]> {
    const gitProvider = await this.findOneOrFail(gitProviderId);
    const authorization = await this.getAuthorization(workspaceId, gitProviderId);

    if (!authorization) {
      throw new Error('Not authorized');
    }

    const account = authorization.account.getEntity();
    const driver = this.clientFactory.createDriver(gitProvider);
    return driver.getBranches(account, owner, repo);
  }
}
