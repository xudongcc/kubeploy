import { AuthRlsModule } from '@nest-boot/auth-rls';
import { RequestContext } from '@nest-boot/request-context';

import { WorkspaceMember } from '@/workspace-member/workspace-member.entity';

const AuthRlsDynamicModule = AuthRlsModule.forRootAsync({
  useFactory: () => {
    return {
      context: (ctx) => {
        const workspaceMember = RequestContext.get(WorkspaceMember);

        if (workspaceMember) {
          ctx.set('workspace_id', workspaceMember.workspace.id);
          ctx.set('workspace_member_id', workspaceMember.id);
        }

        return ctx;
      },
    };
  },
});

export { AuthRlsDynamicModule as AuthRlsModule };
