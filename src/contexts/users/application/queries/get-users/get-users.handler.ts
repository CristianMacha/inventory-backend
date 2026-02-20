import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetUsersQuery } from './get-users.query';
import { Inject } from '@nestjs/common';
import { IUserRepository } from '@contexts/users/domain/repositories/user.repository';
import { UserResponseMapper } from '@contexts/users/application/mappers/user-response.mapper';
import { UserOutputDto } from '@contexts/users/application/dtos/user.output.dto';
import { USERS_TOKENS } from '@contexts/users/users.tokens';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    @Inject(USERS_TOKENS.USER_REPOSITORY)
    private readonly usersReadRepository: IUserRepository,
  ) {}

  async execute(query: GetUsersQuery): Promise<UserOutputDto[]> {
    const entities =
      await this.usersReadRepository.findAllWithRolesPermissions();

    return entities.map((e) => UserResponseMapper.toResponse(e));
  }
}
