import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetRolesPaginatedQuery } from './get-roles-paginated.query';
import { IRoleRepository } from '../.././../domain/repositories/role.repository';
import { RoleResponseMapper } from '../../mappers/role-response.mapper';
import { RoleOutputDto } from '../../dtos/role.output.dto';
import { USERS_TOKENS } from '@contexts/users/users.tokens';
import {
  buildPaginatedResult,
  type PaginatedResult,
} from '@shared/domain/pagination/paginated-result.interface';

@QueryHandler(GetRolesPaginatedQuery)
export class GetRolesPaginatedHandler implements IQueryHandler<GetRolesPaginatedQuery> {
  constructor(
    @Inject(USERS_TOKENS.ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(
    query: GetRolesPaginatedQuery,
  ): Promise<PaginatedResult<RoleOutputDto>> {
    const result = await this.roleRepository.findPaginated(
      query.pagination,
      query.search,
    );

    return buildPaginatedResult(
      result.data.map((r) => RoleResponseMapper.toResponse(r)),
      result.total,
      result.page,
      result.limit,
    );
  }
}
