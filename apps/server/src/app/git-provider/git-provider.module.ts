import { Module } from '@nestjs/common';

import { GitProviderClientFactory } from './git-provider-client.factory';
import { GitProviderResolver } from './git-provider.resolver';
import { GitProviderService } from './git-provider.service';

@Module({
  providers: [GitProviderResolver, GitProviderService, GitProviderClientFactory],
  exports: [GitProviderService, GitProviderClientFactory],
})
export class GitProviderModule {}
