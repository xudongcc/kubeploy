import { Injectable } from '@nestjs/common';

import { GitHubDriver } from './drivers/github.driver';
import { GitLabDriver } from './drivers/gitlab.driver';
import { GitProviderType } from './enums/git-provider-type.enum';
import { GitProvider } from './git-provider.entity';
import { IGitProviderDriver } from './interfaces/git-provider-driver.interface';

@Injectable()
export class GitProviderClientFactory {
  getDriver(gitProvider: GitProvider, accessToken: string): IGitProviderDriver {
    switch (gitProvider.type) {
      case GitProviderType.GITHUB: {
        // GitHub API URL: https://github.com -> https://api.github.com
        const githubApiUrl =
          gitProvider.url === 'https://github.com'
            ? 'https://api.github.com'
            : `${gitProvider.url}/api/v3`; // GitHub Enterprise
        return new GitHubDriver(accessToken, githubApiUrl);
      }
      case GitProviderType.GITLAB: {
        // GitLab API URL: https://gitlab.com -> https://gitlab.com/api/v4
        const gitlabApiUrl = `${gitProvider.url}/api/v4`;
        return new GitLabDriver(accessToken, gitlabApiUrl);
      }
      default:
        throw new Error(`Unsupported git provider type: ${gitProvider.type}`);
    }
  }
}
