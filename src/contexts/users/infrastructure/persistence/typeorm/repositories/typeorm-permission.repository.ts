import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { IPermissionRepository } from '../../../../domain/repositories/permission.repository';
import { Permission } from '../../../../domain/entities/permission';
import { PermissionEntity } from '../entities/permission.entity';
import { PermissionMapper } from '../mappers/permission.mapper';
import { PermissionId } from '@contexts/users/domain/value-objects/permission-id';

@Injectable()
export class TypeOrmPermissionRepository implements IPermissionRepository {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly typeOrmRepository: Repository<PermissionEntity>,
  ) {}

  async findAll(): Promise<Permission[]> {
    const entities = await this.typeOrmRepository.find();
    return entities.map((entity) => PermissionMapper.toDomain(entity));
  }

  async findByName(name: string): Promise<Permission | null> {
    const entity = await this.typeOrmRepository.findOne({ where: { name } });
    return entity ? PermissionMapper.toDomain(entity) : null;
  }

  async findByIds(ids: PermissionId[]): Promise<Permission[]> {
    const entities = await this.typeOrmRepository.findBy({
      id: In(ids.map((i) => i.getValue())),
    });
    return entities.map((entity) => PermissionMapper.toDomain(entity));
  }

  async findByNames(names: string[]): Promise<Permission[]> {
    const entities = await this.typeOrmRepository.findBy({ name: In(names) });
    return entities.map((entity) => PermissionMapper.toDomain(entity));
  }
}
