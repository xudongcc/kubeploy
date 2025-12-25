import { Injectable } from '@nestjs/common';

import { GitHubGitProviderDriver } from './drivers/github.driver';
import { GitLabGitProviderDriver } from './drivers/gitlab.driver';
import { GitProvider } from './entities/git-provider.entity';
import { GitProviderType } from './enums/git-provider-type.enum';
import { GitProviderDriver } from './interfaces/git-provider-driver.interface';

@Injectable()
export class GitProviderClientFactory {
  createDriver(gitProvider: GitProvider): GitProviderDriver {
    switch (gitProvider.type) {
      case GitProviderType.GITHUB:
        return new GitHubGitProviderDriver(gitProvider);
      case GitProviderType.GITLAB:
        return new GitLabGitProviderDriver(gitProvider);
      default:
        throw new Error(`Unsupported git provider type: ${gitProvider.type}`);
    }
  }
}
