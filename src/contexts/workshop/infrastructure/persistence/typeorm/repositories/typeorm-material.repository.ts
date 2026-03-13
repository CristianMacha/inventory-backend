import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IMaterialRepository } from '../../../../domain/repositories/imaterial.repository';
import { Material } from '../../../../domain/entities/material.entity';
import { MaterialId } from '../../../../domain/value-objects/material-id';
import { MaterialTypeormEntity } from '../entities/material.typeorm.entity';
import { MaterialPersistenceMapper } from '../mappers/material-persistence.mapper';
import {
  PaginatedResult,
  buildPaginatedResult,
} from '@shared/domain/pagination/paginated-result.interface';
import { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

@Injectable()
export class TypeOrmMaterialRepository implements IMaterialRepository {
  constructor(
    @InjectRepository(MaterialTypeormEntity)
    private readonly repository: Repository<MaterialTypeormEntity>,
  ) {}

  async findAll(
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Material>> {
    const { page, limit } = pagination;
    const [entities, total] = await this.repository.findAndCount({
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return buildPaginatedResult(
      entities.map((e) => MaterialPersistenceMapper.toDomain(e)),
      total,
      page,
      limit,
    );
  }

  async findById(id: MaterialId): Promise<Material | null> {
    const entity = await this.repository.findOne({
      where: { id: id.getValue() },
    });
    return entity ? MaterialPersistenceMapper.toDomain(entity) : null;
  }

  async findByName(name: string): Promise<Material | null> {
    const entity = await this.repository.findOne({ where: { name } });
    return entity ? MaterialPersistenceMapper.toDomain(entity) : null;
  }

  async save(material: Material): Promise<void> {
    await this.repository.save(
      MaterialPersistenceMapper.toPersistence(material),
    );
  }

  async delete(id: MaterialId): Promise<void> {
    await this.repository.softDelete(id.getValue());
  }
}
