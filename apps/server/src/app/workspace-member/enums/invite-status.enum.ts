import { registerEnumType } from '@nest-boot/graphql';

export enum WorkspaceMemberInviteStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
}

registerEnumType(WorkspaceMemberInviteStatus, {
  name: 'WorkspaceMemberInviteStatus',
});
