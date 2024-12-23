import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './redis/redis.service';
import { RegisterUserDto } from './user/dto/create-user.dto';
import { PermissionGuardGuard } from './permission-guard/permission-guard.guard';

@Controller()
// @UseGuards(PermissionGuardGuard)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  // @SetMetadata('permissions', ['ccc'])
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('redis')
  getRedis(@Query('key') key: string) {
    return this.redisService.get(key);
  }
  @Post('redis')
  setRedis(@Body() object: { key: string; value: string }) {
    console.log('setRedis', object);
    return this.redisService.set(object.key, object.value);
  }
}
