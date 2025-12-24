import type { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';

import { GitProviderType } from '@/git-provider/enums/git-provider-type.enum';
import { GitProvider } from '@/git-provider/entities/git-provider.entity';

export class GitProviderSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // GitHub
    const githubClientId = process.env.GITHUB_CLIENT_ID;
    const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (githubClientId && githubClientSecret) {
      await em.upsert(GitProvider, {
        id: '1',
        name: 'GitHub',
        type: GitProviderType.GITHUB,
        url: 'https://github.com',
        clientId: githubClientId,
        clientSecret: githubClientSecret,
        workspace: null,
      });
    }

    // GitLab
    const gitlabClientId = process.env.GITLAB_CLIENT_ID;
    const gitlabClientSecret = process.env.GITLAB_CLIENT_SECRET;
    const gitlabUrl = process.env.GITLAB_URL ?? 'https://gitlab.com';

    if (gitlabClientId && gitlabClientSecret) {
      await em.upsert(GitProvider, {
        id: '2',
        name: 'GitLab',
        type: GitProviderType.GITLAB,
        url: gitlabUrl,
        clientId: gitlabClientId,
        clientSecret: gitlabClientSecret,
        workspace: null,
      });
    }
  }
}
