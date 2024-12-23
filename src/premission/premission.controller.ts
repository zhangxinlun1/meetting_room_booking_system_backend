import { Body, Controller, Post } from '@nestjs/common';
import { PremissionService } from './premission.service';

@Controller('premission')
export class PremissionController {
  constructor(private readonly premissionService: PremissionService) {}

  @Post()
  async createPermission(
    @Body() permissionData: { name: string; code: string },
  ) {
    return await this.premissionService.createPermission(permissionData);
  }
}
