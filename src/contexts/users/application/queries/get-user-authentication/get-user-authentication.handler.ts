import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetUserAuthenticationQuery } from './get-user-authentication.query';
import { IUserRepository } from '@contexts/users/domain/repositories/user.repository';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { UserResponseMapper } from '../../mappers/user-response.mapper';
import { UserId } from '@contexts/users/domain/value-objects/user-id';
import { UserAuthOutputDto } from '../../dtos/user.output.dto';
import { USERS_TOKENS } from '@contexts/users/users.tokens';

@QueryHandler(GetUserAuthenticationQuery)
export class GetUserAuthenticationHandler implements IQueryHandler<GetUserAuthenticationQuery> {
  constructor(
    @Inject(USERS_TOKENS.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(query: GetUserAuthenticationQuery): Promise<UserAuthOutputDto> {
    const user = await this.userRepository.findById(UserId.create(query.id));
    if (!user) {
      throw new ResourceNotFoundException('User', query.id);
    }

    return UserResponseMapper.toAuthResponse(user);
  }
}
