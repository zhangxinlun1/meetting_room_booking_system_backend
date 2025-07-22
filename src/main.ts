import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // 配置静态文件服务
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/uploaded/',
    index: false, // 禁用默认的index.html
  });
  app.useGlobalPipes(new ValidationPipe());
  const corsOptions: CorsOptions = {
    origin: true, // 允许所有来源，或者使用 ['http://localhost:5173', /^http:\/\/192\.168\.\d+\.\d+:5173$/]
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false, // 根据实际情况决定是否需要跨域携带Cookie等凭证，如果不需要设为false
  };
  app.enableCors(corsOptions);
  const config = new DocumentBuilder()
    .setTitle('My API') // 设置文档标题
    .setDescription('The API description') // 设置文档描述
    .setVersion('1.0') // 设置版本号
    .addTag('example') // 添加标签，用于分类接口
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3333);
  console.log('http://localhost:3333/');
}
bootstrap();
