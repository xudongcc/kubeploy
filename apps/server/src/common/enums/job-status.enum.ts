import { registerEnumType } from '@nest-boot/graphql';

export enum JobStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  FAILED = 'failed',
  DELAYED = 'delayed',
  PRIORITIZED = 'prioritized',
  WAITING = 'waiting',
  WAITING_CHILDREN = 'waiting-children',
  UNKNOWN = 'unknown',
}

registerEnumType(JobStatus, {
  name: 'JobStatus',
});
