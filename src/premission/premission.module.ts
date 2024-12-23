import { Module } from '@nestjs/common';
import { PremissionService } from './premission.service';
import { PremissionController } from './premission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../user/entities/role.entity';
import { Permission } from '../user/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  controllers: [PremissionController],
  providers: [PremissionService],
})
export class PremissionModule {}
