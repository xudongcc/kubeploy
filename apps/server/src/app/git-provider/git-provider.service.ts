import { EntityManager } from '@mikro-orm/core';
import { EntityService } from '@nest-boot/mikro-orm';
import { Injectable } from '@nestjs/common';

import { Account } from '@/auth/entities/account.entity';
import { User } from '@/user/user.entity';

import { GitProviderType } from './enums/git-provider-type.enum';
import { GitProvider } from './git-provider.entity';
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
   * Get OAuth accounts for a specific GitProvider type
   */
  async getAccountsForProvider(
    user: User,
    gitProvider: GitProvider,
  ): Promise<Account[]> {
    const providerId =
      gitProvider.type === GitProviderType.GITHUB ? 'github' : 'gitlab';
    return await this.em.find(Account, {
      userId: user.id,
      providerId,
    });
  }

  /**
   * Get an account by ID
   */
  async getAccountById(accountId: string): Promise<Account | null> {
    return await this.em.findOne(Account, { id: accountId });
  }

  /**
   * List repositories for a given GitProvider and Account
   */
  async listRepositories(
    gitProvider: GitProvider,
    account: Account,
    page?: number,
    perPage?: number,
    search?: string,
  ): Promise<{ repositories: GitRepository[]; totalCount: number }> {
    const driver = this.clientFactory.getDriver(gitProvider, account.accessToken!);
    return driver.listRepositories(page, perPage, search);
  }

  /**
   * List branches of a repository
   */
  async listBranches(
    gitProvider: GitProvider,
    account: Account,
    owner: string,
    repo: string,
  ): Promise<GitBranch[]> {
    const driver = this.clientFactory.getDriver(gitProvider, account.accessToken!);
    return driver.listBranches(owner, repo);
  }
}
