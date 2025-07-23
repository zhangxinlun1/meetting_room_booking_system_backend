import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { StockModule } from './stock/stock.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './user/entities/permission.entity';
import { Role } from './user/entities/role.entity';
import { User } from './user/entities/user.entity';
import { Product } from './product/entities/product.entity';
import { Order } from './order/entities/order.entity';
import { OrderItem } from './order/entities/order-item.entity';
import { StockIn } from './stock/entities/stock-in.entity';
import { StockInItem } from './stock/entities/stock-in-item.entity';
import { StockAdjustment } from './stock/entities/stock-adjustment.entity';

import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RoleModule } from './role/role.module';
import { DataSource } from 'typeorm';
import { PremissionModule } from './premission/premission.module';
import { WeatherModule } from './weather/weather.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './utils/Task';
import { FileUploadModule } from './file-upload/file-upload.module';
import { fileUploadConfig } from './file-upload/file-upload.config';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/uploaded',
    }),
    MulterModule.register(fileUploadConfig),
    FileUploadModule,
    UserModule,
    ProductModule,
    OrderModule,
    StockModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        entities: [User, Permission, Role, Product, Order, OrderItem, StockIn, StockInItem, StockAdjustment],
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', 'woaini520.'),
        database: configService.get(
          'DB_DATABASE',
          'apparel_admin_db',
        ),
        synchronize: true,
        logging: false,
        poolSize: 10,
        timezone: '+08:00',
        autoLoadEntities: true,
        connectorPackage: 'mysql2',
        retryAttempts: 3,
        retryDelay: 3000,
        keepConnectionAlive: true,
      }),
    }),
    EmailModule,
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN'),
          },
        };
      },
      inject: [ConfigService],
    }),
    RoleModule,
    PremissionModule,
    // WeatherModule,
  ],
  controllers: [AppController],
  providers: [AppService, TasksService],
})
export class AppModule {}
