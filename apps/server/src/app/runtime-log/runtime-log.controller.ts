import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, MessageEvent, Param, Query, Sse } from '@nestjs/common';
import { finalize, Observable } from 'rxjs';

import { RuntimeLogService } from './runtime-log.service';

@Controller('api/services')
export class RuntimeLogController {
  constructor(
    private readonly runtimeLogService: RuntimeLogService,
    private readonly em: EntityManager,
  ) {}

  @Sse(':serviceId/runtime-logs')
  async getRuntimeLogs(
    @Param('serviceId') serviceId: string,
    @Query('tailLines') tailLines?: string,
  ): Promise<Observable<MessageEvent>> {
    const observable = await this.runtimeLogService.streamLogs(
      serviceId,
      tailLines ? parseInt(tailLines, 10) : 500,
    );

    // 如果在事务中，则提交事务。
    // 防止长时间流式获取日志导致事务一直不提交。
    if (this.em.isInTransaction()) {
      await this.em.commit();
    }

    return observable;
  }
}
