import { Args, Parent, ResolveField, Resolver } from '@nest-boot/graphql';

import { GitProviderService } from '../services/git-provider.service';
import { GitRepository } from '../objects/git-repository.object';

@Resolver(() => GitRepository)
export class GitRepositoryResolver {
  constructor(private readonly gitProviderService: GitProviderService) {}

  /**
   * Get branches for this repository
   */
  @ResolveField(() => [String])
  async branches(
    @Parent() repository: GitRepository,
    @Args('search', { nullable: true }) search?: string,
  ): Promise<string[]> {
    const workspace = repository.workspace.getEntity();
    const provider = repository.provider.getEntity();

    const branches = await this.gitProviderService.getBranches(
      workspace.id,
      provider.id,
      repository.owner,
      repository.name,
    );

    // Filter branches if search is provided
    const filteredBranches = search
      ? branches.filter((branch) =>
          branch.name.toLowerCase().includes(search.toLowerCase()),
        )
      : branches;

    return filteredBranches.map((branch) => branch.name);
  }
}
