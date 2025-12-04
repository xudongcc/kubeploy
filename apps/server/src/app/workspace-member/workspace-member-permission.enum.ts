import { registerEnumType } from '@nest-boot/graphql';

export enum WorkspaceMemberPermission {
  MANAGE_WORKSPACE = 'MANAGE_WORKSPACE',
  MANAGE_MEMBERS = 'MANAGE_MEMBERS',
  MANAGE_TAGS = 'MANAGE_TAGS',
  MANAGE_FILES = 'MANAGE_FILES',
  DELETE_FILES = 'DELETE_FILES',
}

registerEnumType(WorkspaceMemberPermission, {
  name: 'WorkspacePermission',
});
