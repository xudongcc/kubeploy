import { MessageEvent } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PassThrough } from 'stream';

import { ClusterClientFactory } from '@/cluster';
import { ServiceService } from '@/service/service.service';

@Injectable()
export class RuntimeLogService {
  constructor(
    private readonly serviceService: ServiceService,
    private readonly clusterClientFactory: ClusterClientFactory,
  ) {}

  async streamLogs(
    serviceId: string,
    tailLines = 100,
  ): Promise<Observable<MessageEvent>> {
    const service = await this.serviceService.findOneOrFail({ id: serviceId });
    const project = await service.project.loadOrFail();
    const cluster = await project.cluster.loadOrFail();
    const namespace = project.kubeNamespaceName;

    const log = this.clusterClientFactory.getLog(cluster);
    const coreV1Api = this.clusterClientFactory.getCoreV1Api(cluster);

    // Get the first pod for this service
    const pods = await coreV1Api.listNamespacedPod({
      namespace,
      labelSelector: `kubeploy.com/service-id=${service.id}`,
    });

    if (!pods.items || pods.items.length === 0) {
      throw new Error('No pods found for this service');
    }

    const podName = pods.items[0].metadata?.name;
    if (!podName) {
      throw new Error('Pod name not found');
    }

    // Create a new Observable that streams logs
    return new Observable<MessageEvent>((subscriber) => {
      const stream = new PassThrough();

      // Stream logs from the pod
      log
        .log(
          namespace,
          podName,
          'main', // container name
          stream,
          {
            follow: true,
            tailLines,
            pretty: false,
            timestamps: true,
          },
        )
        .catch((error: unknown) => {
          subscriber.error(error);
        });

      // Convert stream to SSE events
      stream.on('data', (chunk: Buffer) => {
        const lines = chunk.toString().split('\n').filter(Boolean);
        lines.forEach((line) => {
          subscriber.next({
            data: { log: line },
          } as MessageEvent);
        });
      });

      stream.on('error', (error) => {
        subscriber.error(error);
      });

      stream.on('end', () => {
        subscriber.complete();
      });

      // Cleanup on unsubscribe
      return () => {
        stream.destroy();
      };
    });
  }
}
