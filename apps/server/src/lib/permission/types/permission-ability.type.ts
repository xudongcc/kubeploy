import { MongoAbility, Subject } from '@casl/ability';

import { PermissionAction } from '../enums/permission-action.enum';

export type PermissionAbility = MongoAbility<[PermissionAction, Subject]>;
