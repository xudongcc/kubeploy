import { Module } from '@nestjs/common';

import { ClusterModule } from '@/cluster/cluster.module';

import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';

@Module({
  imports: [ClusterModule],
  providers: [ProjectResolver, ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
