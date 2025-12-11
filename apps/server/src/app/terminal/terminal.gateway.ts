import { RequestContext } from '@nest-boot/request-context';
import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PassThrough, Writable } from 'stream';

import { ClusterClientFactory } from '@/cluster';
import { ServiceService } from '@/service/service.service';
import { User } from '@/user/user.entity';
import { UserService } from '@/user/user.service';

import { TerminalGuard } from './terminal.guard';

interface TerminalSession {
  stdin: PassThrough | null;
  abortController: AbortController;
  serviceId: string;
}

@UseGuards(TerminalGuard)
@WebSocketGateway({
  namespace: 'terminal',
  cors: {
    origin: true,
    credentials: true,
  },
})
export class TerminalGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly sessions = new Map<string, TerminalSession>();

  constructor(
    private readonly userService: UserService,
    private readonly serviceService: ServiceService,
    private readonly clusterClientFactory: ClusterClientFactory,
  ) {}

  handleConnection(_client: Socket) {
    // WebSocket 连接建立时，不进行任何操作
  }

  handleDisconnect(client: Socket) {
    // WebSocket 连接断开时，关闭终端会话
    this.closeSession(client.id);
  }

  @SubscribeMessage('start')
  async handleStart(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    { serviceId }: { serviceId: string | null } = { serviceId: null },
  ) {
    const ctx: RequestContext | undefined = client.data.ctx;

    if (!ctx) {
      throw new WsException('Not found request context');
    }

    await RequestContext.run(ctx, async () => {
      if (!serviceId) {
        throw new WsException('Service ID is required');
      }

      const user = RequestContext.get(User);

      if (!user) {
        throw new WsException('Not found user');
      }

      try {
        this.closeSession(client.id);

        const service = await this.serviceService.findOneOrFail({
          id: serviceId,
          workspace: {
            members: {
              user,
            },
          },
        });

        const project = await service.project.loadOrFail();
        const cluster = await project.cluster.loadOrFail();
        const namespace = project.kubeNamespaceName;

        const coreV1Api = this.clusterClientFactory.getCoreV1Api(cluster);
        const exec = this.clusterClientFactory.getExec(cluster);

        // Get the first pod for this service
        const pods = await coreV1Api.listNamespacedPod({
          namespace,
          labelSelector: `kubeploy.com/service-id=${service.id}`,
        });

        if (!pods.items || pods.items.length === 0) {
          client.emit('error', { message: 'No pods found for this service' });
          return;
        }

        const podName = pods.items[0].metadata?.name;
        if (!podName) {
          client.emit('error', { message: 'Pod name not found' });
          return;
        }

        const abortController = new AbortController();

        // Create PassThrough stream for stdin
        const stdin = new PassThrough();

        // Create writable streams for stdout and stderr
        const stdout = new Writable({
          write: (chunk, _encoding, callback) => {
            client.emit('data', chunk.toString());
            callback();
          },
        });

        const stderr = new Writable({
          write: (chunk, _encoding, callback) => {
            client.emit('data', chunk.toString());
            callback();
          },
        });

        // Create terminal session
        exec
          .exec(
            namespace,
            podName,
            'main', // container name
            ['/bin/sh', '-c', 'command -v bash >/dev/null && bash || sh'],
            stdout,
            stderr,
            stdin,
            true, // tty
            (status) => {
              console.log('Terminal status:', status);
            },
          )
          .then(() => {
            client.emit('started');
          })
          .catch((error: unknown) => {
            console.error('Exec error:', error);
            client.emit('error', {
              message: error instanceof Error ? error.message : 'Exec failed',
            });
          });

        this.sessions.set(client.id, {
          stdin,
          abortController,
          serviceId,
        });
      } catch (error) {
        console.error('Terminal start error:', error);
        client.emit('error', {
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });
  }

  @SubscribeMessage('data')
  handleData(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { data: string },
  ) {
    const session = this.sessions.get(client.id);
    if (session?.stdin) {
      session.stdin.write(data.data);
    }
  }

  @SubscribeMessage('resize')
  handleResize(
    @ConnectedSocket() _client: Socket,
    @MessageBody() data: { rows: number; cols: number },
  ) {
    // Terminal resize would require sending escape sequences
    // or using a different approach with node-pty
    console.log('Terminal resize:', data);
  }

  private closeSession(clientId: string) {
    if (!this.sessions) {
      return;
    }
    const session = this.sessions.get(clientId);
    if (session) {
      if (session.stdin) {
        session.stdin.end();
      }
      session.abortController.abort();
      this.sessions.delete(clientId);
    }
  }
}
