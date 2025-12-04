import { S3Client } from '@aws-sdk/client-s3';
import { FileUploadModule } from '@nest-boot/file-upload';
import { ConfigService } from '@nestjs/config';
import bytes from 'bytes';

const FileUploadDynamicModule = FileUploadModule.registerAsync({
  inject: [ConfigService, S3Client],
  useFactory: (configService: ConfigService, client: S3Client) => {
    const fileSize = bytes('500mb');

    if (!fileSize) {
      throw new Error('Invalid file size');
    }

    return {
      url: configService.getOrThrow('S3_URL'),
      bucket: configService.getOrThrow('S3_BUCKET'),
      client,
      limits: [
        {
          fileSize,
          mimeTypes: [
            'image/*',
            'video/*',
            'audio/*',
            // Word (.docx)
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            // Excel (.xlsx)
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            // PowerPoint (.pptx)
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            // Word (.doc)
            'application/msword',
            // Excel (.xls)
            'application/vnd.ms-excel',
            // PowerPoint (.ppt)
            'application/vnd.ms-powerpoint',
            // PDF (.pdf)
            'application/pdf',
            // TXT (.txt)
            'text/plain',
          ],
        },
      ],
    };
  },
});

export { FileUploadDynamicModule as FileUploadModule };
