import { RequestContext } from '@nest-boot/request-context';

import {
  PermissionAbilityBuilder,
  PermissionAction,
  PermissionModule,
} from '@/lib/permission';
import { Workspace } from '@/workspace/workspace.entity';
import { WorkspaceMemberRole } from '@/workspace-member/enums/workspace-member-role.enum';
import { WorkspaceMember } from '@/workspace-member/workspace-member.entity';
import { WorkspaceMemberPermission } from '@/workspace-member/workspace-member-permission.enum';

const PermissionDynamicModule = PermissionModule.forRootAsync({
  useFactory: () => {
    return {
      buildAbility: () => {
        const workspaceMember = RequestContext.get(WorkspaceMember);

        if (!workspaceMember) {
          return null;
        }

        // 合并成员组权限和成员权限，去重, 联合权限，取并集
        const permissions = workspaceMember.permissions;

        const { can, build } = new PermissionAbilityBuilder();

        can(PermissionAction.CREATE, Workspace);

        if (workspaceMember.role === WorkspaceMemberRole.OWNER) {
          can(PermissionAction.MANAGE, 'all');
        } else {
          can(PermissionAction.READ, 'all');
        }

        if (permissions.includes(WorkspaceMemberPermission.MANAGE_WORKSPACE)) {
          can(PermissionAction.MANAGE, Workspace);
        }

        if (permissions.includes(WorkspaceMemberPermission.MANAGE_MEMBERS)) {
          can(PermissionAction.MANAGE, WorkspaceMember);
        }

        return build();
      },
    };
  },
});

export { PermissionDynamicModule as PermissionModule };
