import { RequestContext } from '@nest-boot/request-context';
import { createParamDecorator } from '@nestjs/common';

import { WorkspaceMember } from '@/workspace-member/workspace-member.entity';

export const CurrentWorkspaceMember = createParamDecorator(() =>
  RequestContext.get(WorkspaceMember),
);
