import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { GetUsersQuery } from './get-users.query';
import { UserEntity } from '../../../infrastructure/persistence/typeorm/entities/user.entity';
import { UserListDto } from '../../dtos/user-types.dto';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersReadRepository: Repository<UserEntity>,
  ) {}

  async execute(query: GetUsersQuery): Promise<UserListDto[]> {
    const entities = await this.usersReadRepository.find({
      relations: ['roles', 'roles.permissions'],
    });
    return entities.map(
      (entity) =>
        new UserListDto(
          entity.id,
          entity.name,
          entity.email,
          entity.roles?.map((r) => r.name) || [],
        ),
    );
  }
}
