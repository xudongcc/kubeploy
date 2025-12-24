import { Module } from '@nestjs/common';

import { ClusterModule } from '@/cluster/cluster.module';
import { GitProviderModule } from '@/git-provider/git-provider.module';
import { ProjectModule } from '@/project/project.module';

import { GitSourceResolver } from './resolvers/git-source.resolver';
import { ServiceResolver } from './service.resolver';
import { ServiceService } from './service.service';

@Module({
  imports: [ClusterModule, ProjectModule, GitProviderModule],
  providers: [ServiceResolver, GitSourceResolver, ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
