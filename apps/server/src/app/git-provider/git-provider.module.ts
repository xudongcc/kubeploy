import { Module } from '@nestjs/common';

import { GitProviderAccountService } from './git-provider-account.service';
import { GitProviderClientFactory } from './git-provider-client.factory';
import { GitProviderController } from './git-provider.controller';
import { GitProviderService } from './git-provider.service';
import { GitProviderResolver } from './resolvers/git-provider.resolver';
import { GitRepositoryResolver } from './resolvers/git-repository.resolver';

@Module({
  controllers: [GitProviderController],
  providers: [
    GitProviderResolver,
    GitRepositoryResolver,
    GitProviderService,
    GitProviderAccountService,
    GitProviderClientFactory,
  ],
  exports: [GitProviderService, GitProviderAccountService, GitProviderClientFactory],
})
export class GitProviderModule {}
