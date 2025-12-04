import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { CAN_METADATA, CanOptions } from './decorators/can.decorator';
import { getPermissionAbility } from './utils/get-permission-ability.util';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canOptions = this.reflector.getAllAndOverride<CanOptions>(
      CAN_METADATA,
      [context.getHandler(), context.getClass()],
    );

    if (!canOptions) {
      return true;
    }

    const ability = getPermissionAbility();

    if (!ability) {
      return true;
    }

    return ability.can(
      canOptions.action,
      canOptions.subject.constructor
        ? canOptions.subject
        : await (canOptions.subject as any)(),
    );
  }
}
