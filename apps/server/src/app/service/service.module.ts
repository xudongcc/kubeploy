import { Module } from '@nestjs/common';

import { ClusterModule } from '@/cluster/cluster.module';
import { GitProviderModule } from '@/git-provider/git-provider.module';
import { ProjectModule } from '@/project/project.module';

import { ServiceSourceResolver } from './resolvers/service-source.resolver';
import { ServiceResolver } from './resolvers/service.resolver';
import { ServiceService } from './service.service';

@Module({
  imports: [ClusterModule, ProjectModule, GitProviderModule],
  providers: [ServiceResolver, ServiceSourceResolver, ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
