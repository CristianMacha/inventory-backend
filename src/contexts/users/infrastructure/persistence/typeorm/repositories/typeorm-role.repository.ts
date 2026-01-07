import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IRoleRepository } from '../../../../domain/repositories/role.repository';
import { Role } from '../../../../domain/entities/role';
import { RoleEntity } from '../entities/role.entity';
import { RoleMapper } from '../mappers/role.mapper';
import { RoleId } from '@contexts/users/domain/value-objects/role-id';

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
