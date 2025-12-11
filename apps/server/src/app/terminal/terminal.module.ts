import { Module } from '@nestjs/common';

import { ClusterModule } from '@/cluster/cluster.module';
import { ServiceModule } from '@/service/service.module';
import { UserModule } from '@/user/user.module';

import { TerminalGateway } from './terminal.gateway';
import { TerminalGuard } from './terminal.guard';

@Module({
  imports: [UserModule, ClusterModule, ServiceModule],
  providers: [TerminalGateway, TerminalGuard],
})
export class TerminalModule {}
