import { Octokit } from '@octokit/rest';

import {
  GitBranch,
  GitRepository,
  IGitProviderDriver,
} from '../interfaces/git-provider-driver.interface';

export class GitHubDriver implements IGitProviderDriver {
  private readonly client: Octokit;

  constructor(
    private readonly accessToken: string,
    private readonly apiUrl: string,
  ) {
    this.client = new Octokit({
      auth: accessToken,
      baseUrl: apiUrl,
    });
  }

  async listRepositories(
    page = 1,
    perPage = 30,
    search?: string,
  ): Promise<{ repositories: GitRepository[]; totalCount: number }> {
    if (search) {
      // Use search API for filtering
      const { data } = await this.client.search.repos({
        q: `${search} user:@me`,
        page,
        per_page: perPage,
      });

      return {
        repositories: data.items.map((repo) => this.mapRepository(repo)),
        totalCount: data.total_count,
      };
    }

    // List all repositories for authenticated user
    const { data } = await this.client.repos.listForAuthenticatedUser({
      page,
      per_page: perPage,
      sort: 'updated',
    });

    return {
      repositories: data.map((repo) => this.mapRepository(repo)),
      totalCount: data.length,
    };
  }

  async getRepository(owner: string, repo: string): Promise<GitRepository> {
    const { data } = await this.client.repos.get({ owner, repo });
    return this.mapRepository(data);
  }

  async listBranches(owner: string, repo: string): Promise<GitBranch[]> {
    const { data } = await this.client.repos.listBranches({
      owner,
      repo,
      per_page: 100,
    });

    return data.map((branch) => ({
      name: branch.name,
      sha: branch.commit.sha,
      protected: branch.protected,
    }));
  }

  private mapRepository(repo: {
    id: number;
    name: string;
    full_name: string;
    owner: { login: string } | null;
    description: string | null;
    default_branch: string;
    private: boolean;
    clone_url: string;
    html_url: string;
  }): GitRepository {
    return {
      id: repo.id.toString(),
      name: repo.name,
      fullName: repo.full_name,
      owner: repo.owner?.login ?? '',
      description: repo.description,
      defaultBranch: repo.default_branch,
      private: repo.private,
      cloneUrl: repo.clone_url,
      htmlUrl: repo.html_url,
    };
  }
}
