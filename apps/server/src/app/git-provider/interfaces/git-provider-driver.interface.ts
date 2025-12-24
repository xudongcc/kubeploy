export interface GitRepository {
  id: string;
  name: string;
  fullName: string;
  owner: string;
  description: string | null;
  defaultBranch: string;
  private: boolean;
  cloneUrl: string;
  htmlUrl: string;
}

export interface GitBranch {
  name: string;
  sha: string;
  protected: boolean;
}

export interface IGitProviderDriver {
  /**
   * List repositories accessible by the authenticated user
   * @param page Page number (1-indexed)
   * @param perPage Number of results per page
   * @param search Optional search query
   */
  listRepositories(
    page?: number,
    perPage?: number,
    search?: string,
  ): Promise<{
    repositories: GitRepository[];
    totalCount: number;
  }>;

  /**
   * Get a single repository by owner and repo name
   */
  getRepository(owner: string, repo: string): Promise<GitRepository>;

  /**
   * List branches of a repository
   */
  listBranches(owner: string, repo: string): Promise<GitBranch[]>;
}
