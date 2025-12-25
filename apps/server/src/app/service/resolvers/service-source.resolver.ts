import { Parent, ResolveField, Resolver } from '@nest-boot/graphql';
import { NotFoundException } from '@nestjs/common';

import { GitProviderAuthorization } from '@/git-provider/entities/git-provider-authorization.entity';
import { GitProvider } from '@/git-provider/entities/git-provider.entity';
import { ServiceSource } from '@/service/service.entity';

@Resolver(() => ServiceSource)
export class ServiceSourceResolver {
  @ResolveField(() => GitProvider)
  async provider(@Parent() source: ServiceSource): Promise<GitProvider> {
    const provider = await source.provider.load();

    if (!provider) {
      throw new NotFoundException('GitProvider not found');
    }

    return provider;
  }

  @ResolveField(() => GitProviderAuthorization, { nullable: true })
  async authorization(
    @Parent() source: ServiceSource,
  ): Promise<GitProviderAuthorization | null> {
    return (await source.authorization?.load()) ?? null;
  }
}
