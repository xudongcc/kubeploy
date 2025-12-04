import { registerEnumType } from '@nest-boot/graphql';

export enum WorkspaceFeature {
  AI = 'AI',
}

registerEnumType(WorkspaceFeature, {
  name: 'WorkspaceFeature',
});
