import { Module } from '@nestjs/common';

import { ClusterModule } from '@/cluster/cluster.module';
import { ServiceModule } from '@/service/service.module';

import { DomainResolver } from './domain.resolver';
import { DomainService } from './domain.service';

@Module({
  imports: [ClusterModule, ServiceModule],
  providers: [DomainResolver, DomainService],
  exports: [DomainService],
})
export class DomainModule {}
