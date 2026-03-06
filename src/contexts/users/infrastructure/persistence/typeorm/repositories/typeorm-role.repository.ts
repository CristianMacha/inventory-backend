import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IRoleRepository } from '../../../../domain/repositories/role.repository';
import { Role } from '../../../../domain/entities/role';
import { RoleEntity } from '../entities/role.entity';
import { RoleMapper } from '../mappers/role.mapper';
import { RoleId } from '@contexts/users/domain/value-objects/role-id';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import {
  buildPaginatedResult,
  type PaginatedResult,
} from '@shared/domain/pagination/paginated-result.interface';

@Injectable()
export class TypeOrmRoleRepository implements IRoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly typeOrmRepository: Repository<RoleEntity>,
  ) {}

  async save(role: Role): Promise<void> {
    const entity = RoleMapper.toPersistence(role);
    await this.typeOrmRepository.save(entity);
  }

  async findAll(): Promise<Role[]> {
    const entities = await this.typeOrmRepository.find({
      relations: ['permissions'],
    });
    return entities.map((entity) => RoleMapper.toDomain(entity));
  }

  async findPaginated(
    params: PaginationParams,
    search?: string,
  ): Promise<PaginatedResult<Role>> {
    const { page, limit } = params;
    const qb = this.typeOrmRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.permissions', 'permission')
      .where('1=1');

    if (search) {
      qb.andWhere('r.name LIKE :search', { search: `%${search}%` });
    }

    qb.orderBy('r.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [entities, total] = await qb.getManyAndCount();
    return buildPaginatedResult(
      entities.map((e) => RoleMapper.toDomain(e)),
      total,
      page,
      limit,
    );
  }

  async findById(id: RoleId): Promise<Role | null> {
    const entity = await this.typeOrmRepository.findOne({
      where: { id: id.getValue() },
      relations: ['permissions'],
    });
    return entity ? RoleMapper.toDomain(entity) : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const entity = await this.typeOrmRepository.findOne({
      where: { name },
      relations: ['permissions'],
    });
    return entity ? RoleMapper.toDomain(entity) : null;
  }
}
