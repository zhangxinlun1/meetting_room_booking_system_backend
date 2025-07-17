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
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
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
    const fileUrl = await this.filesService.uploadFile(file);
    return { data: { url: fileUrl } };
  }
}
