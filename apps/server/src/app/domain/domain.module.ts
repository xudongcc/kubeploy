import { Module } from '@nestjs/common';

import { KubernetesModule } from '@/kubernetes';
import { ServiceModule } from '@/service/service.module';

import { DomainResolver } from './domain.resolver';
import { DomainService } from './domain.service';

@Module({
  imports: [KubernetesModule, ServiceModule],
  providers: [DomainResolver, DomainService],
  exports: [DomainService],
})
export class DomainModule {}
