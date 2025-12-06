import { ApiException } from '@kubernetes/client-node';

export function isNotFoundError(error: unknown): boolean {
  return error instanceof ApiException && error.code === 404;
}
