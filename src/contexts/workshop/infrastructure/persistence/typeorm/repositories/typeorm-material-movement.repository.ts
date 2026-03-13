import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IMaterialMovementRepository } from '../../../../domain/repositories/imaterial-movement.repository';
import { MaterialMovement } from '../../../../domain/entities/material-movement.entity';
import { MaterialMovementTypeormEntity } from '../entities/material-movement.typeorm.entity';
import { MaterialMovementPersistenceMapper } from '../mappers/material-movement-persistence.mapper';
import {
  PaginatedResult,
  buildPaginatedResult,
} from '@shared/domain/pagination/paginated-result.interface';
import { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

@Injectable()
export class TypeOrmMaterialMovementRepository implements IMaterialMovementRepository {
  constructor(
    @InjectRepository(MaterialMovementTypeormEntity)
    private readonly repository: Repository<MaterialMovementTypeormEntity>,
  ) {}

  async findByMaterial(
    materialId: string,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<MaterialMovement>> {
    const { page, limit } = pagination;
    const [entities, total] = await this.repository.findAndCount({
      where: { materialId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return buildPaginatedResult(
      entities.map((e) => MaterialMovementPersistenceMapper.toDomain(e)),
      total,
      page,
      limit,
    );
  }

  async getStockForMaterial(materialId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('m')
      .select('COALESCE(SUM(m.delta), 0)', 'stock')
      .where('m.materialId = :materialId', { materialId })
      .getRawOne<{ stock: string }>();
    return Number(result?.stock ?? 0);
  }

  async save(movement: MaterialMovement): Promise<void> {
    await this.repository.save(
      MaterialMovementPersistenceMapper.toPersistence(movement),
    );
  }
}
