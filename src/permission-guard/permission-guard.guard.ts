import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { RoleService } from '../role/role.service';

@Injectable()
export class PermissionGuardGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private roleService: RoleService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!requiredPermissions) {
      return true; // 如果没有标注权限要求，则默认允许访问
    }
    const userRoleId = request.user.roleId;
    const role = await this.roleService.findOne(userRoleId);
    const rolePermissions = role.permissions.map((p) => p.code);
    return requiredPermissions.every((p) => rolePermissions.includes(p));
  }
}
