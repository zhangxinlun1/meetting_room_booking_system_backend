import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../user/entities/role.entity';
import { DataSource, In, Repository } from 'typeorm';
import { Permission } from '../user/entities/permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async createRole(roleData: { name: string }, permissionIds: number[]) {
    let name = roleData.name.trim();
    this.validateRoleName(name);
    const existingRole = await this.roleRepository.findOne({
      where: { name },
    });
    if (existingRole) {
      throw new HttpException(
        '已存在同名角色，请更换角色名称',
        HttpStatus.BAD_REQUEST,
      );
    }
    const permissions = await this.permissionRepository.findBy({
      id: In(permissionIds),
    });
    console.log(permissions);
    const roles = new Role();
    roles.name = name;
    roles.permissions = permissions;
    try {
      // 使用TypeORM的事务机制，通过repository所在的实体管理器来开启事务
      return await this.roleRepository.manager.transaction(
        async (transactionalManager) => {
          // 在事务中使用事务的实体管理器保存角色数据
          return await transactionalManager.save(roles);
        },
      );
    } catch (error) {
      // 如果事务出现错误，抛出合适的异常提示
      throw new HttpException(
        '创建角色失败，请稍后重试',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  private validateRoleName(name: string): void {
    name = name.trim();
    if (!name) {
      throw new HttpException('角色名称不能为空', HttpStatus.BAD_REQUEST);
    }
    if (name.length > 50) {
      throw new HttpException(
        '角色名称长度不能超过50个字符',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async findOne(id: number) {
    return await this.roleRepository.findOne({ where: { id } });
  }

  async findLowAdmin() {
    return await this.roleRepository.findOne({ where: { name: '普通管理员' } });
  }
}
