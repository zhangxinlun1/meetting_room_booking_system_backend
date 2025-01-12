import { Module } from '@nestjs/common';

import { FilesService } from './file-upload.service';
import { FilesController } from './file-upload.controller';
import { fileUploadConfig } from './file-upload.config';
import { MulterModule } from '@nestjs/platform-express';
import { FileInterceptor } from './file.interceptor';

// 配置对象

@Module({
  imports: [MulterModule.register(fileUploadConfig)],
  controllers: [FilesController],
  providers: [FilesService, FileInterceptor],
})
export class FileUploadModule {}
