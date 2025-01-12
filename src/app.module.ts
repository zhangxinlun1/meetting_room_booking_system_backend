import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './user/entities/permission.entity';
import { Role } from './user/entities/role.entity';
import { User } from './user/entities/user.entity';
import { RedisModule } from './redis/redis.module';
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

@Module({
  imports: [
    MulterModule.register(fileUploadConfig),
    FileUploadModule,
    UserModule,
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
        entities: [User, Permission, Role],
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', 'woaini520.'),
        database: configService.get(
          'DB_DATABASE',
          'meeting_room_booking_system',
        ),
        synchronize: true,
        logging: false,
        poolSize: 10,
        timezone: '+08:00',
        autoLoadEntities: true,
        connectorPackage: 'mysql2',
      }),
    }),

    RedisModule,
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
    WeatherModule,
  ],
  controllers: [AppController],
  providers: [AppService, TasksService],
})
export class AppModule {}
