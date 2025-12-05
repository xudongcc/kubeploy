import { Module } from '@nestjs/common';

import { KubernetesModule } from '@/kubernetes/kubernetes.module';

import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';

@Module({
  imports: [KubernetesModule],
  providers: [ProjectResolver, ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
