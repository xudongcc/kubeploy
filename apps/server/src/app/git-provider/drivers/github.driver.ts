import { BadRequestException } from '@nestjs/common';

import { GitProviderAccount } from '../entities/git-provider-account.entity';
import { GitProvider } from '../entities/git-provider.entity';
import {
  GitBranch,
  GitProviderDriver,
  GitRepository,
} from '../interfaces/git-provider-driver.interface';
import { GitProviderTokens } from '../interfaces/git-provider-tokens.interface';
import { GitProviderUserInfo } from '../interfaces/git-provider-user-info.interface';

export class GitHubGitProviderDriver implements GitProviderDriver {
  constructor(private readonly gitProvider: GitProvider) {}

  private get baseUrl(): string {
    return this.gitProvider.url;
  }

  private get apiUrl(): string {
    // GitHub Enterprise uses /api/v3, github.com uses api.github.com
    if (this.baseUrl === 'https://github.com') {
      return 'https://api.github.com';
    }
    return `${this.baseUrl}/api/v3`;
  }

  buildAuthUrl(clientId: string, redirectUri: string, state: string): string {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'repo,read:user',
      state,
    });
    return `${this.baseUrl}/login/oauth/authorize?${params.toString()}`;
  }

  async exchangeCode(
    clientId: string,
    clientSecret: string,
    code: string,
    redirectUri: string,
  ): Promise<GitProviderTokens> {
    const response = await fetch(`${this.baseUrl}/login/oauth/access_token`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new BadRequestException(
        data.error_description || 'Failed to exchange code',
      );
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_in
        ? new Date(Date.now() + data.expires_in * 1000)
        : undefined,
    };
  }

  async getUserInfo(accessToken: string): Promise<GitProviderUserInfo> {
    const response = await fetch(`${this.apiUrl}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new BadRequestException('Failed to get user info from GitHub');
    }

    const data = await response.json();
    return { id: String(data.id) };
  }

  async getRepositories(
    account: GitProviderAccount,
    page = 1,
    perPage = 30,
    search?: string,
  ): Promise<{ repositories: GitRepository[]; totalCount: number }> {
    if (search) {
      const params = new URLSearchParams({
        q: `${search} user:@me`,
        page: page.toString(),
        per_page: perPage.toString(),
      });

      const response = await fetch(
        `${this.apiUrl}/search/repositories?${params.toString()}`,
        {
          headers: this.getHeaders(account),
        },
      );

      if (!response.ok) {
        throw new BadRequestException('Failed to search repositories');
      }

      const data = await response.json();
      return {
        repositories: data.items.map((repo: GitHubRepo) =>
          this.mapRepository(repo),
        ),
        totalCount: data.total_count,
      };
    }

    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      sort: 'updated',
    });

    const response = await fetch(
      `${this.apiUrl}/user/repos?${params.toString()}`,
      {
        headers: this.getHeaders(account),
      },
    );

    if (!response.ok) {
      throw new BadRequestException('Failed to list repositories');
    }

    const data = await response.json();
    return {
      repositories: data.map((repo: GitHubRepo) => this.mapRepository(repo)),
      totalCount: data.length,
    };
  }

  async getRepository(
    account: GitProviderAccount,
    owner: string,
    repo: string,
  ): Promise<GitRepository> {
    const response = await fetch(`${this.apiUrl}/repos/${owner}/${repo}`, {
      headers: this.getHeaders(account),
    });

    if (!response.ok) {
      throw new BadRequestException('Failed to get repository');
    }

    const data = await response.json();
    return this.mapRepository(data);
  }

  async getBranches(
    account: GitProviderAccount,
    owner: string,
    repo: string,
  ): Promise<GitBranch[]> {
    const response = await fetch(
      `${this.apiUrl}/repos/${owner}/${repo}/branches?per_page=100`,
      {
        headers: this.getHeaders(account),
      },
    );

    if (!response.ok) {
      throw new BadRequestException('Failed to list branches');
    }

    const data = await response.json();
    return data.map((branch: GitHubBranch) => ({
      name: branch.name,
      sha: branch.commit.sha,
      protected: branch.protected,
    }));
  }

  private getHeaders(account: GitProviderAccount): Record<string, string> {
    return {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${account.accessToken}`,
    };
  }

  private mapRepository(repo: GitHubRepo): GitRepository {
    return {
      id: repo.id.toString(),
      name: repo.name,
      owner: repo.owner?.login ?? '',
      description: repo.description,
      defaultBranch: repo.default_branch,
      private: repo.private,
      cloneUrl: repo.clone_url,
      htmlUrl: repo.html_url,
    };
  }
}

interface GitHubRepo {
  id: number;
  name: string;
  owner: { login: string } | null;
  description: string | null;
  default_branch: string;
  private: boolean;
  clone_url: string;
  html_url: string;
}

interface GitHubBranch {
  name: string;
  commit: { sha: string };
  protected: boolean;
}
