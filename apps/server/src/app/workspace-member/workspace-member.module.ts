import { Module } from '@nestjs/common';

import { UserModule } from '@/user/user.module';

import { WorkspaceMemberResolver } from './workspace-member.resolver';
import { WorkspaceMemberService } from './workspace-member.service';

@Module({
  imports: [UserModule],
  providers: [WorkspaceMemberService, WorkspaceMemberResolver],
  exports: [WorkspaceMemberService],
})
export class WorkspaceMemberModule {}
