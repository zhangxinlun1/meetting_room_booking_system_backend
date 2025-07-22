import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpCode,
  Get,
} from '@nestjs/common';
import { FilesService } from './file-upload.service';
import { FilesLocalService } from './file-upload-local.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly filesLocalService: FilesLocalService
  ) {}
  @ApiOperation({ summary: '上传文件' })
  @HttpCode(200)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
    console.log('接收到的文件对象:', file);
    try {
      // 使用七牛云上传或本地存储
      const fileUrl = await this.filesService.uploadFile(file);
      console.log('文件上传成功，返回的图片URL:', fileUrl);
      
      // 判断存储类型
      const storage = fileUrl.includes('localhost') ? 'local' : 'qiniu';
      
      return { 
        code: 200,
        message: '上传成功',
        data: { 
          url: fileUrl,
          filename: file.originalname,
          storage: storage
        } 
      };
    } catch (error) {
      console.error('文件上传失败:', error);
      return {
        code: 500,
        message: '上传失败',
        error: error.message
      };
    }
  }
}
