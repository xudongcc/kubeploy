import { AuthService } from '@nest-boot/auth';
import { RequestContext } from '@nest-boot/request-context';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IncomingHttpHeaders } from 'http';
import { Socket } from 'socket.io';

import { User } from '@/user/user.entity';
import { UserService } from '@/user/user.service';

@Injectable()
export class TerminalGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  private async getSession(headers: IncomingHttpHeaders) {
    return await this.authService.api.getSession({
      headers: Object.entries(headers).reduce((headers, [key, value]) => {
        if (value) {
          if (Array.isArray(value)) {
            for (const item of value) {
              headers.append(key, item);
            }
          } else {
            headers.append(key, value);
          }
        }
        return headers;
      }, new Headers()),
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 获取 Socket.IO 客户端连接
    const socket = context.switchToWs().getClient<Socket>();

    // 创建请求上下文
    const ctx = new RequestContext({ type: 'ws' });

    return await RequestContext.run(ctx, async () => {
      // 获取 Session
      const session = await this.getSession(socket.handshake.headers);

      if (!session) {
        return false;
      }

      const user = await this.userService.findOneOrFail({
        id: session.user.id,
      });

      // 将用户信息设置到请求上下文中
      RequestContext.set(User, user);

      // 将请求上下文设置到 socket.data 中，用于在 Gateway 中恢复上下文
      socket.data.ctx = ctx;

      return true;
    });
  }
}
