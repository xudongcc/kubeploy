import { RequestContext } from '@nest-boot/request-context';
import { createParamDecorator } from '@nestjs/common';

import { Workspace } from '@/workspace/workspace.entity';

export const CurrentWorkspace = createParamDecorator(() =>
  RequestContext.get(Workspace),
);
