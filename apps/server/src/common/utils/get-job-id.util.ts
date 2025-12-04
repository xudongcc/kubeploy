import { EntityClass } from '@mikro-orm/core';

export function getJobId<T extends { id: string }>(
  entity: EntityClass<T>,
  id: string,
) {
  return `${entity.name.toLowerCase()}-${id}`;
}
