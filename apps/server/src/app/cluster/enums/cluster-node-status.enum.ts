import { registerEnumType } from '@nest-boot/graphql';

export enum ClusterNodeStatus {
  ACTIVE = 'ACTIVE',
  UNKNOWN = 'UNKNOWN',
}

registerEnumType(ClusterNodeStatus, {
  name: 'ClusterNodeStatus',
});
