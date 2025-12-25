import { GitProviderAccount } from '../entities/git-provider-account.entity';
import { GitProviderTokens } from './git-provider-tokens.interface';
import { GitProviderUserInfo } from './git-provider-user-info.interface';

export interface GitRepository {
  id: string;
  name: string;
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

export interface GitProviderDriver {
  /**
   * Build the OAuth authorization URL
   */
  buildAuthUrl(clientId: string, redirectUri: string, state: string): string;

  /**
   * Exchange authorization code for access tokens
   */
  exchangeCode(
    clientId: string,
    clientSecret: string,
    code: string,
    redirectUri: string,
  ): Promise<GitProviderTokens>;

  /**
   * Get authenticated user info from provider
   */
  getUserInfo(accessToken: string): Promise<GitProviderUserInfo>;

  /**
   * Get repositories accessible by the authenticated user
   */
  getRepositories(
    account: GitProviderAccount,
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
  getRepository(
    account: GitProviderAccount,
    owner: string,
    repo: string,
  ): Promise<GitRepository>;

  /**
   * Get branches of a repository
   */
  getBranches(
    account: GitProviderAccount,
    owner: string,
    repo: string,
  ): Promise<GitBranch[]>;
}
