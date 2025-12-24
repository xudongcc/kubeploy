import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

import { GitProviderType } from '@/git-provider/enums/git-provider-type.enum';
import { GitProvider } from '@/git-provider/git-provider.entity';

export class GitProviderSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // GitHub
    const githubClientId = process.env.GITHUB_CLIENT_ID;
    const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (githubClientId && githubClientSecret) {
      await em.upsert(GitProvider, {
        name: 'GitHub',
        workspace: null,
        type: GitProviderType.GITHUB,
        url: 'https://github.com',
        clientId: githubClientId,
        clientSecret: githubClientSecret,
      });
    }

    // GitLab
    const gitlabClientId = process.env.GITLAB_CLIENT_ID;
    const gitlabClientSecret = process.env.GITLAB_CLIENT_SECRET;
    const gitlabUrl = process.env.GITLAB_URL ?? 'https://gitlab.com';

    if (gitlabClientId && gitlabClientSecret) {
      await em.upsert(GitProvider, {
        name: 'GitLab',
        workspace: null,
        type: GitProviderType.GITLAB,
        url: gitlabUrl,
        clientId: gitlabClientId,
        clientSecret: gitlabClientSecret,
      });
    }
  }
}
