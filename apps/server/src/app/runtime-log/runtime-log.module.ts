import { Module } from '@nestjs/common';

import { ClusterModule } from '@/cluster/cluster.module';
import { ServiceModule } from '@/service/service.module';

import { RuntimeLogController } from './runtime-log.controller';
import { RuntimeLogService } from './runtime-log.service';

@Module({
  imports: [ClusterModule, ServiceModule],
  controllers: [RuntimeLogController],
  providers: [RuntimeLogService],
})
export class RuntimeLogModule {}
