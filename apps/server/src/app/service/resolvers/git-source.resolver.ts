import { Parent, ResolveField, Resolver } from '@nest-boot/graphql';
import { NotFoundException } from '@nestjs/common';

import { GitProvider } from '@/git-provider/entities/git-provider.entity';
import { GitSource } from '@/service/service.entity';

@Resolver(() => GitSource)
export class GitSourceResolver {
  @ResolveField(() => GitProvider)
  async provider(@Parent() gitSource: GitSource): Promise<GitProvider> {
    const account = await gitSource.account.load();
    const provider = await account?.provider.load();

    if (!provider) {
      throw new NotFoundException('GitProvider not found');
    }

    return provider;
  }
}
