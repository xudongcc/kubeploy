import { Module } from '@nestjs/common';

import { GitProviderClientFactory } from './git-provider-client.factory';
import { GitProviderController } from './git-provider.controller';
import { GitProviderAuthorizationResolver } from './resolvers/git-provider-authorization.resolver';
import { GitProviderResolver } from './resolvers/git-provider.resolver';
import { GitRepositoryResolver } from './resolvers/git-repository.resolver';
import { GitProviderAccountService } from './services/git-provider-account.service';
import { GitProviderAuthorizationService } from './services/git-provider-authorization.service';
import { GitProviderService } from './services/git-provider.service';

@Module({
  controllers: [GitProviderController],
  providers: [
    GitProviderAuthorizationResolver,
    GitProviderResolver,
    GitRepositoryResolver,
    GitProviderService,
    GitProviderAccountService,
    GitProviderAuthorizationService,
    GitProviderClientFactory,
  ],
  exports: [
    GitProviderService,
    GitProviderAccountService,
    GitProviderAuthorizationService,
    GitProviderClientFactory,
  ],
})
export class GitProviderModule {}
