import { Module } from '@nestjs/common';

import { ClusterModule } from '@/cluster/cluster.module';
import { ServiceModule } from '@/service/service.module';

import { VolumeResolver } from './volume.resolver';
import { VolumeService } from './volume.service';

@Module({
  imports: [ClusterModule, ServiceModule],
  providers: [VolumeResolver, VolumeService],
  exports: [VolumeService],
})
export class VolumeModule {}
