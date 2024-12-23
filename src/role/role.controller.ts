import { Body, Controller, Inject, Param, Post, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from '../user/entities/role.entity';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Post()
  async createRole(
    @Query() roleData: { name: string },
    @Body('permissionIds') permissionIds: number[],
  ): Promise<void> {
    await this.roleService.createRole(roleData, permissionIds);
  }
}
