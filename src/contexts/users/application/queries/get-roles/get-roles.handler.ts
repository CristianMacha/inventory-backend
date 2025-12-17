import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetRolesQuery } from './get-roles.query';
import { RoleEntity } from '../../../infrastructure/persistence/typeorm/entities/role.entity';
import { RoleOutputDto } from '../../dtos/role.output.dto';
import { PermissionOutputDto } from '../../dtos/permission.output.dto';

@QueryHandler(GetRolesQuery)
export class GetRolesHandler implements IQueryHandler<GetRolesQuery> {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async execute(query: GetRolesQuery): Promise<RoleOutputDto[]> {
    const roles = await this.roleRepository.find({
      relations: ['permissions'],
    });

    return roles.map(
      (role) =>
        new RoleOutputDto(
          role.id,
          role.name,
          role.permissions
            ? role.permissions.map(
                (p) => new PermissionOutputDto(p.id, p.name, p.description),
              )
            : [],
        ),
    );
  }
}
