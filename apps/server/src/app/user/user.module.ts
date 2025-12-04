import { Module } from '@nestjs/common';

import { WorkspaceModule } from '@/workspace/workspace.module';

import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [WorkspaceModule],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
