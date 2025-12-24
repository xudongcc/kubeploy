import { EntityManager } from '@mikro-orm/core';
import { AuthGuard, CurrentUser } from '@nest-boot/auth';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { User } from '@/user/user.entity';

import { GitProviderType } from './enums/git-provider-type.enum';
import { GitProviderAccount } from './entities/git-provider-account.entity';
import { GitProvider } from './entities/git-provider.entity';
import { GitProviderService } from './git-provider.service';

interface OAuthState {
  userId: string;
  workspaceId: string;
  redirectUri: string;
  gitProviderId: string;
}

interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
}

interface ProviderUserInfo {
  id: string;
  username: string;
}

@Controller('api/git-providers')
export class GitProviderController {
  constructor(
    private readonly gitProviderService: GitProviderService,
    private readonly configService: ConfigService,
    private readonly em: EntityManager,
  ) {}

  /**
   * GET /api/git-providers/:id/authorize
   * Redirect to OAuth authorization page
   */
  @Get(':id/authorize')
  @UseGuards(AuthGuard)
  async authorize(
    @Param('id') id: string,
    @Query('workspace_id') workspaceId: string,
    @Query('redirect_uri') redirectUri: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ): Promise<void> {
    if (!workspaceId) {
      throw new BadRequestException('Missing workspace_id parameter');
    }

    const gitProvider = await this.gitProviderService.findOneOrFail(id);
    // Load lazy fields
    await this.em.populate(gitProvider, ['clientId', 'clientSecret']);

    // state contains userId, workspaceId and redirectUri for callback verification
    const state: OAuthState = {
      userId: user.id,
      workspaceId,
      redirectUri,
      gitProviderId: id,
    };
    const encodedState = Buffer.from(JSON.stringify(state)).toString('base64');

    const authUrl = this.buildAuthUrl(gitProvider, encodedState);
    res.redirect(authUrl);
  }

  /**
   * GET /api/git-providers/:id/callback
   * Handle OAuth callback
   */
  @Get(':id/callback')
  async callback(
    @Param('id') id: string,
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!code) {
      throw new BadRequestException('Missing authorization code');
    }

    if (!state) {
      throw new BadRequestException('Missing state parameter');
    }

    // Parse state
    const { userId, workspaceId, redirectUri }: OAuthState = JSON.parse(
      Buffer.from(state, 'base64').toString(),
    );

    const gitProvider = await this.gitProviderService.findOneOrFail(id);
    // Load lazy fields
    await this.em.populate(gitProvider, ['clientId', 'clientSecret']);

    // Exchange code for access token
    const tokens = await this.exchangeCode(gitProvider, code);

    // Get user info from provider
    const userInfo = await this.getUserInfo(gitProvider, tokens.accessToken);

    // Create or update GitProviderAccount
    const existingAccount = await this.em.findOne(GitProviderAccount, {
      workspace: workspaceId,
      provider: id,
      providerUserId: userInfo.id,
    });

    if (existingAccount) {
      existingAccount.accessToken = tokens.accessToken;
      existingAccount.refreshToken = tokens.refreshToken;
      existingAccount.expiresAt = tokens.expiresAt;
      existingAccount.username = userInfo.username;
    } else {
      const account = this.em.create(GitProviderAccount, {
        workspace: workspaceId,
        user: userId,
        provider: id,
        providerUserId: userInfo.id,
        username: userInfo.username,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt,
      });
      this.em.persist(account);
    }

    await this.em.flush();

    res.redirect(redirectUri);
  }

  private getCallbackUrl(gitProviderId: string): string {
    const appUrl = this.configService.get<string>('APP_URL');
    return `${appUrl}/api/git-providers/${gitProviderId}/callback`;
  }

  private buildAuthUrl(gitProvider: GitProvider, state: string): string {
    const callbackUrl = this.getCallbackUrl(gitProvider.id);

    if (gitProvider.type === GitProviderType.GITHUB) {
      const params = new URLSearchParams({
        client_id: gitProvider.clientId,
        redirect_uri: callbackUrl,
        scope: 'repo,read:user',
        state,
      });
      return `https://github.com/login/oauth/authorize?${params.toString()}`;
    }

    if (gitProvider.type === GitProviderType.GITLAB) {
      const params = new URLSearchParams({
        client_id: gitProvider.clientId,
        redirect_uri: callbackUrl,
        response_type: 'code',
        scope: 'api read_user read_repository',
        state,
      });
      return `${gitProvider.url}/oauth/authorize?${params.toString()}`;
    }

    throw new Error(`Unsupported git provider type: ${gitProvider.type}`);
  }

  private async exchangeCode(
    gitProvider: GitProvider,
    code: string,
  ): Promise<OAuthTokens> {
    const callbackUrl = this.getCallbackUrl(gitProvider.id);

    if (gitProvider.type === GitProviderType.GITHUB) {
      const response = await fetch(
        'https://github.com/login/oauth/access_token',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: gitProvider.clientId,
            client_secret: gitProvider.clientSecret,
            code,
            redirect_uri: callbackUrl,
          }),
        },
      );

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

    if (gitProvider.type === GitProviderType.GITLAB) {
      const response = await fetch(`${gitProvider.url}/oauth/token`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: gitProvider.clientId,
          client_secret: gitProvider.clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: callbackUrl,
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

    throw new Error(`Unsupported git provider type: ${gitProvider.type}`);
  }

  private async getUserInfo(
    gitProvider: GitProvider,
    accessToken: string,
  ): Promise<ProviderUserInfo> {
    if (gitProvider.type === GitProviderType.GITHUB) {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new BadRequestException('Failed to get user info from GitHub');
      }

      const data = await response.json();
      return {
        id: String(data.id),
        username: data.login,
      };
    }

    if (gitProvider.type === GitProviderType.GITLAB) {
      const response = await fetch(`${gitProvider.url}/api/v4/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new BadRequestException('Failed to get user info from GitLab');
      }

      const data = await response.json();
      return {
        id: String(data.id),
        username: data.username,
      };
    }

    throw new Error(`Unsupported git provider type: ${gitProvider.type}`);
  }
}
