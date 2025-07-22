import { Injectable } from '@nestjs/common';
import * as qiniu from 'qiniu';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  private readonly accessKey: string;
  private readonly secretKey: string;
  private readonly bucket: string;
  private readonly qiniuDomain: string;
  private readonly useLocalStorage: boolean;

  constructor() {
    this.accessKey = process.env.QINIU_ACCESS_KEY;
    this.secretKey = process.env.QINIU_SECRET_KEY;
    this.bucket = process.env.QINIU_BUCKET_NAME;
    this.qiniuDomain = process.env.QINIU_DOMAIN;
    
    // 检查七牛云配置，如果没有配置则使用本地存储
    this.useLocalStorage = !this.accessKey || !this.secretKey || !this.bucket || !this.qiniuDomain;
    
    console.log('=== 文件上传配置检查 ===');
    console.log('Access Key:', this.accessKey ? '已设置' : '未设置');
    console.log('Secret Key:', this.secretKey ? '已设置' : '未设置');
    console.log('Bucket:', this.bucket);
    console.log('Domain:', this.qiniuDomain);
    console.log('使用本地存储:', this.useLocalStorage);
    console.log('========================');
    
    if (this.useLocalStorage) {
      console.log('七牛云配置不完整，将使用本地存储');
      this.initLocalStorage();
    }
  }

  // 初始化本地存储
  private initLocalStorage() {
    const uploadDir = path.join(process.cwd(), 'public', 'uploaded');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    console.log('本地存储目录:', uploadDir);
  }

  // 生成七牛云上传令牌
  private generateUploadToken(): string {
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: this.bucket,
      expires: 300,
    });
    return putPolicy.uploadToken(
      new qiniu.auth.digest.Mac(this.accessKey, this.secretKey),
    );
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new Error('文件不能为空');
    }

    try {
      if (this.useLocalStorage) {
        return await this.uploadToLocal(file);
      } else {
        return await this.uploadToQiniu(file);
      }
    } catch (error) {
      console.error('文件上传出错:', error);
      throw new Error('文件上传失败');
    }
  }

  // 上传到七牛云
  private async uploadToQiniu(file: Express.Multer.File): Promise<string> {
    // 生成唯一的文件名
    const fileExtension = file.originalname.split('.').pop();
    const key = `${uuidv4()}.${fileExtension}`;
    
    // 生成上传令牌
    const token = this.generateUploadToken();
    
    // 配置上传
    const config = new qiniu.conf.Config();
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();

    // 上传文件到七牛云
    const result = await new Promise<string>((resolve, reject) => {
      formUploader.put(
        token,
        key,
        file.buffer,
        putExtra,
        (respErr, respBody, respInfo) => {
          if (respErr) {
            console.error('七牛云上传错误:', respErr);
            reject(respErr);
          } else if (respInfo.statusCode === 200) {
            // 返回完整的CDN URL
            const fileUrl = `${this.qiniuDomain}/${key}`;
            console.log('文件上传成功:', fileUrl);
            console.log('七牛云响应:', respBody);
            resolve(fileUrl);
          } else {
            console.error('七牛云上传失败，状态码:', respInfo.statusCode);
            reject(new Error(`文件上传失败，状态码: ${respInfo.statusCode}`));
          }
        },
      );
    });

    return result;
  }

  // 上传到本地存储
  private async uploadToLocal(file: Express.Multer.File): Promise<string> {
    const uploadDir = path.join(process.cwd(), 'public', 'uploaded');
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // 确保目录存在
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 写入文件
    fs.writeFileSync(filePath, file.buffer);

    // 返回可访问的URL
    const fileUrl = `http://localhost:3333/uploaded/${fileName}`;
    console.log('本地文件上传成功:', fileUrl);
    
    return fileUrl;
  }
}
