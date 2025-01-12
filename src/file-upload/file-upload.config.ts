import { MulterModuleOptions } from '@nestjs/platform-express';
import * as qiniu from 'qiniu';

export const fileUploadConfig: MulterModuleOptions = {
  limits: {
    // 可以设置文件大小限制等参数，这里示例设置最大文件大小为5MB，可根据实际需求调整
    fileSize: 1024 * 1024 * 5,
  },
  // 自定义文件存储配置函数，这里用于配置七牛云上传相关逻辑
  storage: (req, file, cb) => {
    console.log(file, 'filefilefilefilefilefilefilefile');
    console.log('七牛云Access Key:', process.env.QINIU_ACCESS_KEY);
    console.log('七牛云Secret Key:', process.env.QINIU_SECRET_KEY);
    console.log('七牛云Bucket名称:', process.env.QINIU_BUCKET_NAME);
    const accessKey = process.env.QINIU_ACCESS_KEY;
    const secretKey = process.env.QINIU_SECRET_KEY;
    const bucket = process.env.QINIU_BUCKET_NAME;

    qiniu.conf.ACCESS_KEY = accessKey;
    qiniu.conf.SECRET_KEY = secretKey;

    const key = file.originalname;
    const putPolicy = new qiniu.rs.PutPolicy({ scope: bucket });
    const token = putPolicy.uploadToken();

    cb(null, token);
  },
};
