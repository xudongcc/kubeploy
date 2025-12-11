import { Controller, MessageEvent, Param, Query, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';

import { RuntimeLogService } from './runtime-log.service';

@Controller('api/services')
export class RuntimeLogController {
  constructor(private readonly runtimeLogService: RuntimeLogService) {}

  @Sse(':serviceId/runtime-logs')
  async getRuntimeLogs(
    @Param('serviceId') serviceId: string,
    @Query('tailLines') tailLines?: string,
  ): Promise<Observable<MessageEvent>> {
    return await this.runtimeLogService.streamLogs(
      serviceId,
      tailLines ? parseInt(tailLines, 10) : 500,
    );
  }
}
