import { AuthMiddleware } from '@nest-boot/auth';
import { MiddlewareManager, MiddlewareModule } from '@nest-boot/middleware';
import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { PermissionGuard } from './permission.guard';
import { PermissionMiddleware } from './permission.middleware';
import { ConfigurableModuleClass } from './permission.module-definition';

@Global()
@Module({
  imports: [MiddlewareModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    PermissionMiddleware,
  ],
})
export class PermissionModule extends ConfigurableModuleClass {
  constructor(
    private readonly middlewareManager: MiddlewareManager,
    private readonly permissionMiddleware: PermissionMiddleware,
  ) {
    super();

    this.middlewareManager
      .apply(this.permissionMiddleware)
      .dependencies(AuthMiddleware)
      .forRoutes('*');
  }
}
