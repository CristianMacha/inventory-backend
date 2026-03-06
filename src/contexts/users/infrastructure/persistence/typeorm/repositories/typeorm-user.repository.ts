import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  IUserRepository,
  UserFilters,
} from '../../../../domain/repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { User } from '../../../../domain/entities/user';
import { UserMapper } from '../mappers/user.mapper';
import { UserId } from '@contexts/users/domain/value-objects/user-id';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import {
  buildPaginatedResult,
  type PaginatedResult,
} from '@shared/domain/pagination/paginated-result.interface';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly typeOrmRepository: Repository<UserEntity>,
  ) {}

  async findById(id: UserId): Promise<User | null> {
    const user = await this.typeOrmRepository.findOne({
      where: { id: id.getValue() },
      relations: ['roles', 'roles.permissions'],
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.typeOrmRepository.findOne({
      where: { email },
      relations: ['roles', 'roles.permissions'],
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByExternalId(
    provider: string,
    externalId: string,
  ): Promise<User | null> {
    const user = await this.typeOrmRepository.findOne({
      where: { provider, externalId },
      relations: ['roles', 'roles.permissions'],
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findAllWithRolesPermissions(): Promise<User[]> {
    const users = await this.typeOrmRepository.find({
      relations: ['roles', 'roles.permissions'],
    });

    return users.map((e) => UserMapper.toDomain(e));
  }

  async findPaginated(
    params: PaginationParams,
    filters?: UserFilters,
  ): Promise<PaginatedResult<User>> {
    const { page, limit } = params;
    const qb = this.typeOrmRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.roles', 'role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .where('1=1');

    if (filters?.search) {
      qb.andWhere('(u.name LIKE :search OR u.email LIKE :search)', {
        search: `%${filters.search}%`,
      });
    }
    if (filters?.roleId) {
      qb.andWhere('role.id = :roleId', { roleId: filters.roleId });
    }

    qb.orderBy('u.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [entities, total] = await qb.getManyAndCount();
    return buildPaginatedResult(
      entities.map((e) => UserMapper.toDomain(e)),
      total,
      page,
      limit,
    );
  }

  async save(user: User): Promise<void> {
    const userEntity = UserMapper.toPersistence(user);
    await this.typeOrmRepository.save(userEntity);
  }
}
