import { Module } from '@nestjs/common';

import { ClusterModule } from '@/cluster/cluster.module';
import { CommonModule } from '@/common/common.module';
import { DomainModule } from '@/domain/domain.module';
import { ProjectModule } from '@/project/project.module';
import { RuntimeLogModule } from '@/runtime-log/runtime-log.module';
import { ServiceModule } from '@/service/service.module';
import { UserModule } from '@/user/user.module';
import { VolumeModule } from '@/volume/volume.module';
import { WorkspaceModule } from '@/workspace/workspace.module';
import { WorkspaceMemberModule } from '@/workspace-member/workspace-member.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    WorkspaceModule,
    WorkspaceMemberModule,
    ClusterModule,
    ProjectModule,
    ServiceModule,
    RuntimeLogModule,
    DomainModule,
    VolumeModule,
  ],
})
export class AppModule {}
