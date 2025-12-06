import { Module } from '@nestjs/common';

import { ClusterModule } from '@/cluster/cluster.module';
import { ProjectModule } from '@/project/project.module';

import { ServiceResolver } from './service.resolver';
import { ServiceService } from './service.service';

@Module({
  imports: [ClusterModule, ProjectModule],
  providers: [ServiceResolver, ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
