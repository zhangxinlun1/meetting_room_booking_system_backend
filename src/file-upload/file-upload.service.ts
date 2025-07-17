import { Injectable } from '@nestjs/common';
import * as qiniu from 'qiniu';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  private readonly accessKey: string;
  private readonly secretKey: string;
  private readonly bucket: string;
  private readonly qiniuDomain: string;

  constructor() {
    this.accessKey = process.env.QINIU_ACCESS_KEY;
    this.secretKey = process.env.QINIU_SECRET_KEY;
    this.bucket = process.env.QINIU_BUCKET_NAME;
    this.qiniuDomain = process.env.QINIU_DOMAIN;
    if (
      !this.accessKey ||
      !this.secretKey ||
      !this.bucket ||
      !this.qiniuDomain
    ) {
      throw new Error('七牛云相关环境变量未正确设置');
    }
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

  // 生成包含令牌和过期时间的完整文件 URL
  private generateFileUrlWithToken(
    key: string,
    deadline: number = 300000,
  ): string {
    const mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey);
    const getPolicy = new qiniu.rs.PutPolicy({
      scope: `${this.bucket}`,
      expires: deadline,
    });
    const encodedEntryURI = qiniu.util.urlsafeBase64Encode(
      `${this.bucket}:${key}`,
    );
    console.log(`${this.bucket}:${key}`, '`${this.bucket}:${key}`');
    const token = getPolicy.uploadToken(mac);
    console.log(token, 'token');
    console.log(
      `${this.qiniuDomain}/${encodedEntryURI}?e=${deadline}&token=${token}`,
    );
    return `${this.qiniuDomain}/${key}?e=${deadline}&token=${token}`;
  }

  async uploadFile(file: Express.Multer.File): Promise<{ data: string }> {
    qiniu.conf.ACCESS_KEY = this.accessKey;
    qiniu.conf.SECRET_KEY = this.secretKey;
    if (!file) {
      throw new Error('文件不能为空');
    }
    // 生成更合理的文件名，考虑文件类型
    const fileExtension = file.originalname.split('.').pop();
    const key = uuidv4() + '.' + fileExtension;
    const token = this.generateUploadToken();
    const config = new qiniu.conf.Config();
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();

    try {
      const resp = await new Promise<string>((resolve, reject) => {
        formUploader.putFile(
          token,
          key,
          file.path,
          putExtra,
          (respErr, respBody, respInfo) => {
            if (respErr) {
              reject(respErr);
            } else if (respInfo.statusCode === 200) {
              // 生成包含令牌和过期时间的完整文件 URL
              const url = this.generateFileUrlWithToken(key);
              resolve(url);
            } else {
              reject(new Error(`文件上传失败，状态码: ${respInfo.statusCode}`));
            }
          },
        );
      });
      return { data: resp };
    } catch (error) {
      // 这里可以添加日志记录，例如使用 winston 记录错误日志
      console.error('文件上传出错:', error);
      throw error;
    }
  }
}
