import axios, { AxiosInstance } from 'axios';

import {
  GitBranch,
  GitRepository,
  IGitProviderDriver,
} from '../interfaces/git-provider-driver.interface';

export class GitLabDriver implements IGitProviderDriver {
  private readonly client: AxiosInstance;

  constructor(
    private readonly accessToken: string,
    private readonly apiUrl: string,
  ) {
    this.client = axios.create({
      baseURL: apiUrl,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  async listRepositories(
    page = 1,
    perPage = 30,
    search?: string,
  ): Promise<{ repositories: GitRepository[]; totalCount: number }> {
    const params: Record<string, unknown> = {
      page,
      per_page: perPage,
      membership: true,
      order_by: 'last_activity_at',
    };

    if (search) {
      params.search = search;
    }

    const response = await this.client.get<GitLabProject[]>('/projects', {
      params,
    });
    const totalCount = parseInt(
      (response.headers['x-total'] as string) || '0',
      10,
    );

    return {
      repositories: response.data.map((project) => this.mapRepository(project)),
      totalCount,
    };
  }

  async getRepository(owner: string, repo: string): Promise<GitRepository> {
    const projectPath = encodeURIComponent(`${owner}/${repo}`);
    const { data } = await this.client.get<GitLabProject>(
      `/projects/${projectPath}`,
    );
    return this.mapRepository(data);
  }

  async listBranches(owner: string, repo: string): Promise<GitBranch[]> {
    const projectPath = encodeURIComponent(`${owner}/${repo}`);
    const { data } = await this.client.get<GitLabBranch[]>(
      `/projects/${projectPath}/repository/branches`,
      {
        params: { per_page: 100 },
      },
    );

    return data.map((branch) => ({
      name: branch.name,
      sha: branch.commit.id,
      protected: branch.protected,
    }));
  }

  private mapRepository(project: GitLabProject): GitRepository {
    return {
      id: project.id.toString(),
      name: project.path,
      fullName: project.path_with_namespace,
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
  path_with_namespace: string;
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
