import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  console.log('http://localhost:3333');
  const config = new DocumentBuilder()
    .setTitle('My API') // 设置文档标题
    .setDescription('The API description') // 设置文档描述
    .setVersion('1.0') // 设置版本号
    .addTag('example') // 添加标签，用于分类接口
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3333);
}
bootstrap();
