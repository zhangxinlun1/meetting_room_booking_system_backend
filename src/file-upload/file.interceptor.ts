import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { FileInterceptor as NestFileInterceptor } from '@nestjs/platform-express';
import { fileUploadConfig } from './file-upload.config';

@Injectable()
export class FileInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const file = request.file;
    console.log('在拦截器中获取到的文件对象:', file);
    const fileInterceptor = NestFileInterceptor('file', fileUploadConfig);
    return next.handle().pipe(
      map((response) => {
        console.log('拦截器中响应对象：', response);
        if (response.statusCode === 200) {
          console.log('文件上传成功，具体信息：', response.data);
          const { fileUrl } = response.data;
          console.log('文件访问地址：', fileUrl);
          return response;
        } else {
          console.log('文件上传出现问题，状态码：', response.statusCode);
          const errorMessage = `文件上传失败，错误码：${response.statusCode}`;
          return {
            ...response,
            errorMessage,
          };
        }
      }),
    );
  }
}
