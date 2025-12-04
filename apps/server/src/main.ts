import { Logger } from '@nest-boot/logger';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: true,
  });

  app.useLogger(await app.resolve(Logger));

  app.useGlobalPipes(
    new ValidationPipe({ transform: true, forbidUnknownValues: false }),
  );

  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 4000);
}

void bootstrap();
