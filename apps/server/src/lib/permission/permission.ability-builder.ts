import { AbilityBuilder, createMongoAbility } from '@casl/ability';

import { PermissionAbility } from './types/permission-ability.type';

export class PermissionAbilityBuilder extends AbilityBuilder<PermissionAbility> {
  constructor() {
    super(createMongoAbility);
  }
}
