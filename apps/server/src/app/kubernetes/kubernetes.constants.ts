import { PatchStrategy, setHeaderOptions } from '@kubernetes/client-node';

export const fieldManager = 'kubeploy';

export const configurationOptions = setHeaderOptions(
  'Content-Type',
  PatchStrategy.ServerSideApply,
);
