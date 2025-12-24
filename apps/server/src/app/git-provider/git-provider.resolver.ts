import { CurrentUser } from '@nest-boot/auth';
import { Args, ID, Int, Query, Resolver } from '@nest-boot/graphql';
import { ConnectionManager } from '@nest-boot/graphql-connection';

import { User } from '@/user/user.entity';

import {
  GitProviderConnection,
  GitProviderConnectionArgs,
} from './git-provider.connection-definition';
import { GitProvider } from './git-provider.entity';
import { GitProviderService } from './git-provider.service';
import { GitAccountObject } from './objects/git-account.object';
import { GitBranchObject } from './objects/git-branch.object';
import { GitRepositoryObject } from './objects/git-repository.object';

@Resolver(() => GitProvider)
export class GitProviderResolver {
  constructor(
    private readonly gitProviderService: GitProviderService,
    private readonly cm: ConnectionManager,
  ) {}

  @Query(() => GitProvider, { nullable: true })
  async gitProvider(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<GitProvider | null> {
    return await this.gitProviderService.findOne(id);
  }

  /**
   * Get all available GitProviders
   */
  @Query(() => GitProviderConnection)
  async gitProviders(@Args() args: GitProviderConnectionArgs) {
    return await this.cm.find(GitProviderConnection, args);
  }

  /**
   * Get OAuth accounts for a specific GitProvider
   */
  @Query(() => [GitAccountObject])
  async gitAccounts(
    @CurrentUser() user: User,
    @Args('gitProviderId', { type: () => ID }) gitProviderId: string,
  ): Promise<GitAccountObject[]> {
    const gitProvider =
      await this.gitProviderService.findOneOrFail(gitProviderId);
    const accounts = await this.gitProviderService.getAccountsForProvider(
      user,
      gitProvider,
    );

    return accounts.map((account) => ({
      id: account.id,
      providerId: account.providerId,
      accountId: account.accountId,
      username: undefined, // BaseAccount doesn't have username field
    }));
  }

  /**
   * Get repositories for a GitProvider and Account
   */
  @Query(() => [GitRepositoryObject])
  async gitRepositories(
    @Args('gitProviderId', { type: () => ID }) gitProviderId: string,
    @Args('accountId') accountId: string,
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('perPage', { type: () => Int, nullable: true }) perPage?: number,
    @Args('search', { nullable: true }) search?: string,
  ): Promise<GitRepositoryObject[]> {
    const gitProvider =
      await this.gitProviderService.findOneOrFail(gitProviderId);
    const account = await this.gitProviderService.getAccountById(accountId);

    if (!account) {
      throw new Error('Account not found');
    }

    const result = await this.gitProviderService.listRepositories(
      gitProvider,
      account,
      page,
      perPage,
      search,
    );

    return result.repositories.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.fullName,
      owner: repo.owner,
      description: repo.description ?? undefined,
      defaultBranch: repo.defaultBranch,
      private: repo.private,
      cloneUrl: repo.cloneUrl,
      htmlUrl: repo.htmlUrl,
    }));
  }

  /**
   * Get branches for a repository
   */
  @Query(() => [GitBranchObject])
  async gitBranches(
    @Args('gitProviderId', { type: () => ID }) gitProviderId: string,
    @Args('accountId') accountId: string,
    @Args('owner') owner: string,
    @Args('repo') repo: string,
  ): Promise<GitBranchObject[]> {
    const gitProvider =
      await this.gitProviderService.findOneOrFail(gitProviderId);
    const account = await this.gitProviderService.getAccountById(accountId);

    if (!account) {
      throw new Error('Account not found');
    }

    const branches = await this.gitProviderService.listBranches(
      gitProvider,
      account,
      owner,
      repo,
    );

    return branches.map((branch) => ({
      name: branch.name,
      sha: branch.sha,
      protected: branch.protected,
    }));
  }
}
