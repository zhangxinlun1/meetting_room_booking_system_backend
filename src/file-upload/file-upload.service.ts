import { Injectable } from '@nestjs/common';
import * as qiniu from 'qiniu';

@Injectable()
export class FilesService {
  private readonly accessKey: string;
  private readonly secretKey: string;
  private readonly bucket: string;

  constructor() {
    this.accessKey = process.env.QINIU_ACCESS_KEY;
    this.secretKey = process.env.QINIU_SECRET_KEY;
    this.bucket = process.env.QINIU_BUCKET_NAME;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    qiniu.conf.ACCESS_KEY = this.accessKey;
    qiniu.conf.SECRET_KEY = this.secretKey;
    console.log('service', file);
    if (!file) return;
    const key = file.originalname;
    const putPolicy = new qiniu.rs.PutPolicy({ scope: this.bucket });
    const token = putPolicy.uploadToken();
    const config = new qiniu.conf.Config();
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();

    try {
      const resp = await new Promise((resolve, reject) => {
        formUploader.putFile(
          token,
          key,
          file.path,
          putExtra,
          (respErr, respBody, respInfo) => {
            if (respErr) {
              reject(respErr);
            } else if (respInfo.statusCode === 200) {
              resolve('http://' + this.bucket + '.qiniudn.com/' + key);
            } else {
              reject(new Error(`文件上传失败，状态码: ${respInfo.statusCode}`));
            }
          },
        );
      });
      return resp as string;
    } catch (error) {
      throw error;
    }
  }
}
