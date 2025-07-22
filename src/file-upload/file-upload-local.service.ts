import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesLocalService {
  private readonly uploadDir: string;

  constructor() {
    // 确保上传目录存在
    this.uploadDir = path.join(process.cwd(), 'public', 'uploaded');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
    console.log('本地文件存储目录:', this.uploadDir);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new Error('文件不能为空');
    }

    try {
      // 生成唯一的文件名
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const filePath = path.join(this.uploadDir, fileName);

      // 检查文件是否有buffer，如果没有则读取文件
      if (file.buffer) {
        // 将文件写入本地目录
        fs.writeFileSync(filePath, file.buffer);
      } else if (file.path) {
        // 如果文件已经保存到临时位置，直接复制
        const tempPath = file.path;
        fs.copyFileSync(tempPath, filePath);
      } else {
        throw new Error('文件数据不可用');
      }

      // 返回可访问的URL
      const fileUrl = `http://localhost:3333/uploaded/${fileName}`;
      console.log('本地文件上传成功:', fileUrl);
      
      return fileUrl;
    } catch (error) {
      console.error('本地文件上传出错:', error);
      throw new Error('文件上传失败');
    }
  }
} 