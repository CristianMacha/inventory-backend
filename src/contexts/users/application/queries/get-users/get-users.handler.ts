import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetUsersQuery } from './get-users.query';
import { IUserRepository } from '@contexts/users/domain/repositories/user.repository';
import { UserResponseMapper } from '@contexts/users/application/mappers/user-response.mapper';
import { UserOutputDto } from '@contexts/users/application/dtos/user.output.dto';
import { USERS_TOKENS } from '@contexts/users/users.tokens';
import {
  buildPaginatedResult,
  type PaginatedResult,
} from '@shared/domain/pagination/paginated-result.interface';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    @Inject(USERS_TOKENS.USER_REPOSITORY)
    private readonly usersReadRepository: IUserRepository,
  ) {}

  async execute(query: GetUsersQuery): Promise<PaginatedResult<UserOutputDto>> {
    const filters =
      query.search || query.roleId
        ? { search: query.search, roleId: query.roleId }
        : undefined;

    const result = await this.usersReadRepository.findPaginated(
      query.pagination,
      filters,
    );

    return buildPaginatedResult(
      result.data.map((u) => UserResponseMapper.toResponse(u)),
      result.total,
      result.page,
      result.limit,
    );
  }
}
