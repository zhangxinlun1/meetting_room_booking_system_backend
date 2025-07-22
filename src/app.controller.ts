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

import { RegisterUserDto } from './user/dto/create-user.dto';
import { PermissionGuardGuard } from './permission-guard/permission-guard.guard';

@Controller()
// @UseGuards(PermissionGuardGuard)
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  // @SetMetadata('permissions', ['ccc'])
  getHello(): string {
    return this.appService.getHello();
  }
  // Redis endpoints removed
}
