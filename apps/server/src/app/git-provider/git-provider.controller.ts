import { EntityManager } from '@mikro-orm/postgresql';
import { AuthGuard, CurrentUser } from '@nest-boot/auth';
import { AuthRlsService } from '@nest-boot/auth-rls';
import { RequestContext } from '@nest-boot/request-context';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { User } from '@/user/user.entity';
import { WorkspaceMember } from '@/workspace-member/workspace-member.entity';
import { Workspace } from '@/workspace/workspace.entity';

import { GitProviderAccount } from './entities/git-provider-account.entity';
import { GitProviderAuthorization } from './entities/git-provider-authorization.entity';
import { GitProvider } from './entities/git-provider.entity';
import { GitProviderClientFactory } from './git-provider-client.factory';
import { GitProviderState } from './interfaces/git-provider-state.interface';

@Controller('api/git-providers')
export class GitProviderController {
  constructor(
    private readonly authRlsService: AuthRlsService,
    private readonly configService: ConfigService,
    private readonly em: EntityManager,
    private readonly clientFactory: GitProviderClientFactory,
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

    // Verify user has access to the workspace
    const workspaceMember = await this.em.findOne(WorkspaceMember, {
      user,
      workspace: workspaceId,
    });

    if (!workspaceMember) {
      throw new UnauthorizedException(
        'User does not have access to this workspace',
      );
    }

    // Verify gitProvider exists and user has access (system provider or workspace provider)
    const gitProvider = await this.em.findOne(
      GitProvider,
      {
        id,
        $or: [{ workspace: null }, { workspace: workspaceId }],
      },
      { populate: ['clientId', 'clientSecret'] },
    );

    if (!gitProvider) {
      throw new UnauthorizedException(
        'Git provider not found or not accessible',
      );
    }

    const driver = this.clientFactory.createDriver(gitProvider);
    const callbackUrl = this.getCallbackUrl(gitProvider.id);

    // state contains workspaceId and redirectUri for callback verification
    const state: GitProviderState = {
      workspaceId,
      redirectUri,
    };
    const encodedState = Buffer.from(JSON.stringify(state)).toString('base64');

    const authUrl = driver.buildAuthUrl(
      gitProvider.clientId,
      callbackUrl,
      encodedState,
    );
    res.redirect(authUrl);
  }

  /**
   * GET /api/git-providers/:id/callback
   * Handle OAuth callback
   */
  @Get(':id/callback')
  async callback(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (!code) {
      throw new BadRequestException('Missing authorization code');
    }

    if (!state) {
      throw new BadRequestException('Missing state parameter');
    }

    // Parse state
    const { workspaceId, redirectUri }: GitProviderState = JSON.parse(
      Buffer.from(state, 'base64').toString(),
    );

    const workspaceMember = await this.em.findOne(
      WorkspaceMember,
      {
        user,
        workspace: {
          id: workspaceId,
        },
      },
      { populate: ['workspace'] },
    );

    RequestContext.set(WorkspaceMember, workspaceMember);
    RequestContext.set(Workspace, workspaceMember?.workspace.getEntity());

    await this.em.transactional(async (em) => {
      await this.authRlsService.setRlsContext(em, user);

      // Verify gitProvider exists and user has access (system provider or workspace provider)
      const gitProvider = await em.findOneOrFail(
        GitProvider,
        {
          id,
          $or: [{ workspace: null }, { workspace: workspaceId }],
        },
        { populate: ['clientId', 'clientSecret'] },
      );

      const driver = this.clientFactory.createDriver(gitProvider);
      const callbackUrl = this.getCallbackUrl(gitProvider.id);

      // Exchange code for access token
      const tokens = await driver.exchangeCode(
        gitProvider.clientId,
        gitProvider.clientSecret,
        code,
        callbackUrl,
      );

      // Get user info from provider
      const userInfo = await driver.getUserInfo(tokens.accessToken);

      // Step 1: Find or create GitProviderAccount (user level)
      let account = await em.findOne(GitProviderAccount, {
        user,
        provider: id,
        providerUserId: userInfo.id,
      });

      if (account) {
        account.accessToken = tokens.accessToken;
        account.refreshToken = tokens.refreshToken;
        account.expiresAt = tokens.expiresAt;
      } else {
        account = em.create(GitProviderAccount, {
          user,
          provider: id,
          providerUserId: userInfo.id,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: tokens.expiresAt,
        });

        em.persist(account);
      }

      // Step 2: Find WorkspaceMember
      const member = await em.findOneOrFail(WorkspaceMember, {
        workspace: workspaceId,
        user,
      });

      // Step 3: Find or create GitProviderAuthorization (workspace level)
      const existingAuthorization = await em.findOne(GitProviderAuthorization, {
        member,
        account,
      });

      if (!existingAuthorization) {
        const authorization = em.create(GitProviderAuthorization, {
          workspace: workspaceId,
          member,
          account,
        });

        em.persist(authorization);
      }

      await em.flush();

      res.redirect(redirectUri);
    });
  }

  private getCallbackUrl(gitProviderId: string): string {
    const appUrl = this.configService.get<string>('APP_URL');
    return `${appUrl}/api/git-providers/${gitProviderId}/callback`;
  }
}
