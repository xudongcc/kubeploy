import { Module } from '@nestjs/common';

import { KubernetesModule } from '@/kubernetes/kubernetes.module';
import { ProjectModule } from '@/project/project.module';

import { ServiceResolver } from './service.resolver';
import { ServiceService } from './service.service';

@Module({
  imports: [KubernetesModule, ProjectModule],
  providers: [ServiceResolver, ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
