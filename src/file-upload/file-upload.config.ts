import { MulterModuleOptions } from '@nestjs/platform-express';

export const fileUploadConfig: MulterModuleOptions = {
  limits: {
    // 可以设置文件大小限制等参数，这里示例设置最大文件大小为5MB，可根据实际需求调整
    fileSize: 1024 * 1024 * 5,
  },
  // 使用内存存储，文件会在服务中处理
  storage: undefined,
};
