import { ConfigurableModuleBuilder } from '@nestjs/common';

import { PermissionModuleOptions } from './interfaces/permission-module-options.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<PermissionModuleOptions>()
    .setClassMethodName('forRoot')
    .build();
