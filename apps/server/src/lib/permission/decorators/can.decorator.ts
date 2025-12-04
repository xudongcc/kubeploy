import { Subject } from '@casl/ability';
import { CustomDecorator, FactoryProvider, SetMetadata } from '@nestjs/common';
import { Type } from '@nestjs/common';

import { PermissionAction } from '../enums/permission-action.enum';
import { PermissionAbility } from '../types/permission-ability.type';

export const CAN_METADATA = Symbol('CAN_METADATA');

export type CanHandler = (ability: PermissionAbility) => boolean;

export interface CanOptions<T extends Subject = Subject> {
  action: PermissionAction;
  subject: Type<T> | FactoryProvider<T>['useFactory'];
  inject?: FactoryProvider['inject'];
}

export function Can<T extends Subject = Subject>(
  action: PermissionAction,
  subject: Type<T>,
): CustomDecorator<typeof CAN_METADATA>;

export function Can<T extends Subject = Subject>(
  options: CanOptions<T>,
): CustomDecorator<typeof CAN_METADATA>;

export function Can<T extends Subject = Subject>(
  actionOrOptions: PermissionAction | CanOptions<T>,
  subject?: Type<T>,
): CustomDecorator<typeof CAN_METADATA> {
  if (typeof actionOrOptions === 'object') {
    return SetMetadata(CAN_METADATA, actionOrOptions);
  }

  return SetMetadata(CAN_METADATA, {
    action: actionOrOptions,
    subject,
  });
}
