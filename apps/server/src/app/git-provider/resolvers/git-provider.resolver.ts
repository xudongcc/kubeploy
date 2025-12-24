import {
  Args,
  ID,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nest-boot/graphql';
import { ConnectionManager } from '@nest-boot/graphql-connection';
import { ref } from '@mikro-orm/core';

import { CurrentWorkspace } from '@/common/decorators/current-workspace.decorator';
import { Workspace } from '@/workspace/workspace.entity';

import {
  GitProviderConnection,
  GitProviderConnectionArgs,
} from '../git-provider.connection-definition';
import { GitProvider } from '../entities/git-provider.entity';
import { GitProviderService } from '../git-provider.service';
import { GitRepository } from '../objects/git-repository.object';

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
   * Check if workspace has authorized this GitProvider
   */
  @ResolveField(() => Boolean)
  async authorized(
    @Parent() gitProvider: GitProvider,
    @CurrentWorkspace() workspace: Workspace,
  ): Promise<boolean> {
    return await this.gitProviderService.isAuthorized(
      workspace.id,
      gitProvider.id,
    );
  }

  /**
   * Get repositories for this GitProvider
   */
  @ResolveField(() => [GitRepository])
  async repositories(
    @Parent() gitProvider: GitProvider,
    @CurrentWorkspace() workspace: Workspace,
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('perPage', { type: () => Int, nullable: true }) perPage?: number,
    @Args('search', { nullable: true }) search?: string,
  ): Promise<GitRepository[]> {
    const result = await this.gitProviderService.listRepositories(
      workspace.id,
      gitProvider.id,
      page,
      perPage,
      search,
    );

    return result.repositories.map((repo) => ({
      id: repo.id,
      workspace: ref(workspace),
      provider: ref(gitProvider),
      name: repo.name,
      fullName: repo.fullName,
      owner: repo.owner,
      defaultBranch: repo.defaultBranch,
      cloneUrl: repo.cloneUrl,
      htmlUrl: repo.htmlUrl,
    }));
  }

  /**
   * Get a single repository by owner and name
   */
  @ResolveField(() => GitRepository, { nullable: true })
  async repository(
    @Parent() gitProvider: GitProvider,
    @CurrentWorkspace() workspace: Workspace,
    @Args('owner') owner: string,
    @Args('repo') repo: string,
  ): Promise<GitRepository | null> {
    const result = await this.gitProviderService.listRepositories(
      workspace.id,
      gitProvider.id,
      1,
      1,
      `${owner}/${repo}`,
    );

    const foundRepo = result.repositories.find(
      (r) => r.owner === owner && r.name === repo,
    );

    if (!foundRepo) {
      return null;
    }

    return {
      id: foundRepo.id,
      workspace: ref(workspace),
      provider: ref(gitProvider),
      name: foundRepo.name,
      fullName: foundRepo.fullName,
      owner: foundRepo.owner,
      defaultBranch: foundRepo.defaultBranch,
      cloneUrl: foundRepo.cloneUrl,
      htmlUrl: foundRepo.htmlUrl,
    };
  }
}
