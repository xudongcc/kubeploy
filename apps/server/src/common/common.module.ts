import { AuthGuard } from '@nest-boot/auth';
import { BullModule } from '@nest-boot/bullmq';
import { GraphQLModule } from '@nest-boot/graphql';
import { GraphQLConnectionModule } from '@nest-boot/graphql-connection';
import { LoggerModule } from '@nest-boot/logger';
import { MikroOrmModule } from '@nest-boot/mikro-orm';
import { RequestTransactionModule } from '@nest-boot/mikro-orm-request-transaction';
import { RedisModule } from '@nest-boot/redis';
import { RequestContextModule } from '@nest-boot/request-context';
import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AuthModule } from '@/common/modules/auth.module';
import { AuthRlsModule } from '@/common/modules/auth-rls.module';
import { ConfigModule } from '@/common/modules/config.module';
import { PermissionModule } from '@/common/modules/permission.module';

@Global()
@Module({
  imports: [
    RequestContextModule,
    RequestTransactionModule,
    AuthModule,
    AuthRlsModule,
    ConfigModule,
    MikroOrmModule,
    GraphQLModule.forRoot({
      subscriptions: {
        'graphql-ws': true,
      },
    }),
    GraphQLConnectionModule,
    BullModule,
    RedisModule,
    LoggerModule,
    PermissionModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'client'),
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class CommonModule {}
