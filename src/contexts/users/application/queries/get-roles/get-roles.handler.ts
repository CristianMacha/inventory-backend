import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetRolesQuery } from './get-roles.query';
import { RoleOutputDto } from '../../dtos/role.output.dto';
import { RoleResponseMapper } from '@contexts/users/application/mappers/role-response.mapper';
import { Inject } from '@nestjs/common';
import { IRoleRepository } from '@contexts/users/domain/repositories/role.repository';
import { USERS_TOKENS } from '@contexts/users/users.tokens';

@QueryHandler(GetRolesQuery)
export class GetRolesHandler implements IQueryHandler<GetRolesQuery> {
  constructor(
    @Inject(USERS_TOKENS.ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(): Promise<RoleOutputDto[]> {
    const roles = await this.roleRepository.findAll();

    return roles.map((e) => RoleResponseMapper.toResponse(e));
  }
}
