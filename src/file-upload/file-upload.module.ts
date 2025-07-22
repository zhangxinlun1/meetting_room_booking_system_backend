import { Module } from '@nestjs/common';

import { FilesService } from './file-upload.service';
import { FilesLocalService } from './file-upload-local.service';
import { FilesController } from './file-upload.controller';
import { fileUploadConfig } from './file-upload.config';
import { MulterModule } from '@nestjs/platform-express';
import { FileInterceptor } from './file.interceptor';
import { join, extname } from 'path';
import { diskStorage } from 'multer';

// 配置对象

@Module({
  imports: [
    MulterModule.register({
      // 使用内存存储，这样文件会以buffer形式传递
      storage: undefined,
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService, FilesLocalService, FileInterceptor],
})
export class FileUploadModule {}
