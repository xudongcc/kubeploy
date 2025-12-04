import { RequestContext } from '@nest-boot/request-context';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { PermissionModuleOptions } from './interfaces/permission-module-options.interface';
import { PERMISSION_ABILITY } from './permission.constants';
import { MODULE_OPTIONS_TOKEN } from './permission.module-definition';

@Injectable()
export class PermissionMiddleware implements NestMiddleware {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: PermissionModuleOptions,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const ability = await this.options.buildAbility({ req, res });

    if (ability) {
      res.locals.ability = ability;
      RequestContext.set(PERMISSION_ABILITY, ability);
    }

    next();
  }
}
