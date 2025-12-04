import { RequestContext } from '@nest-boot/request-context';

import { PERMISSION_ABILITY } from '../permission.constants';
import { PermissionAbility } from '../types/permission-ability.type';

export const getPermissionAbility = () =>
  RequestContext.get<PermissionAbility>(PERMISSION_ABILITY);
