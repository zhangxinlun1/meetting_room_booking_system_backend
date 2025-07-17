import { Module } from '@nestjs/common';

import { FilesService } from './file-upload.service';
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
      // 用于配置上传，这部分也可以写在路由上
      storage: diskStorage({
        // destination: join(__dirname, '../images'),
        destination: join('./public/uploaded'),
        filename: (_, file, callback) => {
          const fileName = `${
            new Date().getTime() + extname(file.originalname)
          }`;
          return callback(null, fileName);
        },
      }),
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService, FileInterceptor],
})
export class FileUploadModule {}
