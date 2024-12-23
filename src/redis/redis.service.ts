import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async get(key: string) {
    if (!key) return;
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    const data = await this.redisClient.set(key, value);
    console.log(key, value, data);
    if (ttl) {
      const data = await this.redisClient.expire(key, ttl);
      console.log(key, ttl, data);
    }
  }

  async del(key: string) {
    await this.redisClient.del(key);
  }
}
