import { Module } from '@nestjs/common';

import { CommonModule } from '@/common/common.module';
import { ProjectModule } from '@/project/project.module';
import { ServiceModule } from '@/service/service.module';
import { UserModule } from '@/user/user.module';
import { WorkspaceModule } from '@/workspace/workspace.module';
import { WorkspaceMemberModule } from '@/workspace-member/workspace-member.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    WorkspaceModule,
    WorkspaceMemberModule,
    ProjectModule,
    ServiceModule,
  ],
})
export class AppModule {}
