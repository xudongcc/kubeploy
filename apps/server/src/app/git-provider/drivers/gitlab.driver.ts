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

export class GitLabGitProviderDriver implements GitProviderDriver {
  constructor(private readonly gitProvider: GitProvider) {}

  private get baseUrl(): string {
    return this.gitProvider.url;
  }

  private get apiUrl(): string {
    return `${this.baseUrl}/api/v4`;
  }

  buildAuthUrl(clientId: string, redirectUri: string, state: string): string {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'api read_user read_repository',
      state,
    });
    return `${this.baseUrl}/oauth/authorize?${params.toString()}`;
  }

  async exchangeCode(
    clientId: string,
    clientSecret: string,
    code: string,
    redirectUri: string,
  ): Promise<GitProviderTokens> {
    const response = await fetch(`${this.baseUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
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
      },
    });

    if (!response.ok) {
      throw new BadRequestException('Failed to get user info from GitLab');
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
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      membership: 'true',
      order_by: 'last_activity_at',
    });

    if (search) {
      params.set('search', search);
    }

    const response = await fetch(`${this.apiUrl}/projects?${params.toString()}`, {
      headers: this.getHeaders(account),
    });

    if (!response.ok) {
      throw new BadRequestException('Failed to list repositories');
    }

    const totalCount = parseInt(response.headers.get('x-total') || '0', 10);
    const data: GitLabProject[] = await response.json();

    return {
      repositories: data.map((project) => this.mapRepository(project)),
      totalCount,
    };
  }

  async getRepository(
    account: GitProviderAccount,
    owner: string,
    repo: string,
  ): Promise<GitRepository> {
    const projectPath = encodeURIComponent(`${owner}/${repo}`);
    const response = await fetch(`${this.apiUrl}/projects/${projectPath}`, {
      headers: this.getHeaders(account),
    });

    if (!response.ok) {
      throw new BadRequestException('Failed to get repository');
    }

    const data: GitLabProject = await response.json();
    return this.mapRepository(data);
  }

  async getBranches(
    account: GitProviderAccount,
    owner: string,
    repo: string,
  ): Promise<GitBranch[]> {
    const projectPath = encodeURIComponent(`${owner}/${repo}`);
    const response = await fetch(
      `${this.apiUrl}/projects/${projectPath}/repository/branches?per_page=100`,
      {
        headers: this.getHeaders(account),
      },
    );

    if (!response.ok) {
      throw new BadRequestException('Failed to list branches');
    }

    const data: GitLabBranch[] = await response.json();
    return data.map((branch) => ({
      name: branch.name,
      sha: branch.commit.id,
      protected: branch.protected,
    }));
  }

  private getHeaders(account: GitProviderAccount): Record<string, string> {
    return {
      Authorization: `Bearer ${account.accessToken}`,
    };
  }

  private mapRepository(project: GitLabProject): GitRepository {
    return {
      id: project.id.toString(),
      name: project.path,
      owner: project.namespace.path,
      description: project.description,
      defaultBranch: project.default_branch,
      private: project.visibility === 'private',
      cloneUrl: project.http_url_to_repo,
      htmlUrl: project.web_url,
    };
  }
}

interface GitLabProject {
  id: number;
  path: string;
  namespace: {
    path: string;
  };
  description: string | null;
  default_branch: string;
  visibility: 'private' | 'internal' | 'public';
  http_url_to_repo: string;
  web_url: string;
}

interface GitLabBranch {
  name: string;
  commit: {
    id: string;
  };
  protected: boolean;
}
