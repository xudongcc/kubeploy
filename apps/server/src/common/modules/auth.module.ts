import { EntityManager } from '@mikro-orm/postgresql';
import { AuthModule } from '@nest-boot/auth';
import { RequestContext } from '@nest-boot/request-context';
import { ConfigService } from '@nestjs/config';

import { Account } from '@/auth/entities/account.entity';
import { Session } from '@/auth/entities/session.entity';
import { Verification } from '@/auth/entities/verification.entity';
import { User } from '@/user/user.entity';
import { Workspace } from '@/workspace/workspace.entity';
import { WorkspaceMember } from '@/workspace-member/workspace-member.entity';

const AuthDynamicModule = AuthModule.forRootAsync({
  inject: [ConfigService, EntityManager],
  useFactory: (configService: ConfigService, em: EntityManager) => ({
    trustedOrigins: ['*'],
    socialProviders: (() => {
      const githubClientId = configService.get('GITHUB_CLIENT_ID');
      const githubClientSecret = configService.get('GITHUB_CLIENT_SECRET');

      const gitlabUrl = configService.get('GITLAB_URL', 'https://gitlab.com');
      const gitlabClientId = configService.get('GITLAB_CLIENT_ID');
      const gitlabClientSecret = configService.get('GITLAB_CLIENT_SECRET');

      return {
        ...(githubClientId && githubClientSecret
          ? {
              github: {
                clientId: githubClientId,
                clientSecret: githubClientSecret,
              },
            }
          : {}),
        ...(gitlabClientId && gitlabClientSecret
          ? {
              gitlab: {
                url: gitlabUrl,
                clientId: gitlabClientId,
                clientSecret: gitlabClientSecret,
              },
            }
          : {}),
      };
    })(),
    entities: {
      user: User,
      account: Account,
      session: Session,
      verification: Verification,
    },
    onAuthenticated: async ({ req, res }) => {
      const user: User | undefined = res.locals.user;
      const workspaceId = req.headers['x-workspace-id'];

      if (user && typeof workspaceId === 'string') {
        const workspaceMember = await em.findOne(
          WorkspaceMember,
          {
            user,
            workspace: {
              id: workspaceId,
            },
          },
          { populate: ['workspace'] },
        );

        if (workspaceMember) {
          const workspace = workspaceMember.workspace.getEntity();

          if (workspace) {
            res.locals.workspace = workspace;
            res.locals.workspaceMember = workspaceMember;

            RequestContext.set(Workspace, workspace);
            RequestContext.set(WorkspaceMember, workspaceMember);
          }
        }
      }
    },
  }),
});

export { AuthDynamicModule as AuthModule };
