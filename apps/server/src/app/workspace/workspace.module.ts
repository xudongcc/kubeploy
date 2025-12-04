import { Module } from '@nestjs/common';

import { WorkspaceResolver } from './workspace.resolver';
import { WorkspaceService } from './workspace.service';

@Module({
  providers: [WorkspaceResolver, WorkspaceService],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
