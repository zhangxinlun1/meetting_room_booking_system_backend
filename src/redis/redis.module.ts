import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        console.log({
          host: configService.get<string>('REDIS_SERVE_HOST'),
          port: configService.get<number>('REDIS_SERVE_PORT'),
        });
        const client = createClient({
          socket: {
            host: configService.get<string>('REDIS_SERVE_HOST'),
            port: configService.get<number>('REDIS_SERVE_PORT'),
          },
          database: 1,
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
