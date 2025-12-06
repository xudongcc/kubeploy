import { Module } from '@nestjs/common';

import { WorkspaceModule } from '@/workspace/workspace.module';

import { ClusterClientFactory } from './cluster-client.factory';
import { ClusterResolver } from './cluster.resolver';
import { ClusterService } from './cluster.service';

@Module({
  imports: [WorkspaceModule],
  providers: [ClusterResolver, ClusterService, ClusterClientFactory],
  exports: [ClusterService, ClusterClientFactory],
})
export class ClusterModule {}
