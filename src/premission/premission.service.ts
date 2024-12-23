import { Injectable } from '@nestjs/common';
import { Permission } from '../user/entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PremissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}
  async createPermission(permissionData: { name: string; code: string }) {
    const newPermission = this.permissionRepository.create(permissionData);
    return await this.permissionRepository.save(newPermission);
  }
}
