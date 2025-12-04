import { Request, Response } from 'express';

import { PermissionAbility } from '../types/permission-ability.type';

export type BuildAbilityCallback = (ctx: {
  req: Request;
  res: Response;
}) => PermissionAbility | null | Promise<PermissionAbility | null>;

export interface PermissionModuleOptions {
  buildAbility: BuildAbilityCallback;
}
