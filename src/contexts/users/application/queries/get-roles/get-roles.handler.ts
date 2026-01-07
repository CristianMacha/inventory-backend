import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetRolesQuery } from './get-roles.query';
import { RoleEntity } from '../../../infrastructure/persistence/typeorm/entities/role.entity';
import { RoleOutputDto } from '../../dtos/role.output.dto';
import { PermissionOutputDto } from '../../dtos/permission.output.dto';
import { RoleResponseMapper } from '@contexts/users/application/mappers/role-response.mapper';
import { Inject } from '@nestjs/common';
import { IRoleRepository } from '@contexts/users/domain/repositories/role.repository';

@QueryHandler(GetRolesQuery)
export class GetRolesHandler implements IQueryHandler<GetRolesQuery> {
  constructor(
    @Inject('RoleRepository')
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(query: GetRolesQuery): Promise<RoleOutputDto[]> {
    const roles = await this.roleRepository.findAll();

    return roles.map((e) => RoleResponseMapper.toResponse(e));
  }
}
