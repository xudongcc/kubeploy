import { S3Client } from '@aws-sdk/client-s3';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const providers = [
  {
    provide: S3Client,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      return new S3Client({
        region: configService.get('S3_REGION'),
        endpoint: configService.getOrThrow('S3_ENDPOINT'),
        credentials: {
          accessKeyId: configService.getOrThrow('S3_ACCESS_KEY_ID'),
          secretAccessKey: configService.getOrThrow('S3_SECRET_ACCESS_KEY'),
        },
        forcePathStyle: configService.get('S3_FORCE_PATH_STYLE') === 'true',
      });
    },
  },
];

@Global()
@Module({
  providers,
  exports: providers,
})
export class S3Module {}
