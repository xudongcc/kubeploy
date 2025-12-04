import { registerEnumType } from '@nest-boot/graphql';

export enum WorkspaceMemberRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

registerEnumType(WorkspaceMemberRole, {
  name: 'WorkspaceMemberRole',
});
