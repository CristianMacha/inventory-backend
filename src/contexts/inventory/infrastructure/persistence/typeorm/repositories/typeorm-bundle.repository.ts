import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import {
  IBundleRepository,
  BundleWithRelations,
} from '@contexts/inventory/domain/repositories/bundle.repository';
import { Bundle } from '@contexts/inventory/domain/entities/bundle';
import { Slab } from '@contexts/inventory/domain/entities/slab';
import { BundleId } from '@contexts/inventory/domain/value-objects/bundle-id';
import { BundleEntity } from '../entities/bundle.entity';
import { SlabEntity } from '../entities/slab.entity';
import { BundleMapper } from '../mappers/bundle.mapper';
import { SlabMapper } from '../mappers/slab.mapper';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import {
  buildPaginatedResult,
  type PaginatedResult,
} from '@shared/domain/pagination/paginated-result.interface';

@Injectable()
export class TypeOrmBundleRepository implements IBundleRepository {
  constructor(
    @InjectRepository(BundleEntity)
    private readonly repository: Repository<BundleEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async save(bundle: Bundle): Promise<void> {
    const entity = BundleMapper.toPersistence(bundle);
    await this.repository.save(entity);
  }

  async saveWithSlabs(bundle: Bundle, slabs: Slab[]): Promise<void> {
    const bundleEntity = BundleMapper.toPersistence(bundle);
    const slabEntities = slabs.map((s) => SlabMapper.toPersistence(s));

    await this.dataSource.transaction(async (manager) => {
      await manager.save(BundleEntity, bundleEntity);
      if (slabEntities.length > 0) {
        await manager.save(SlabEntity, slabEntities);
      }
    });
  }

  async findById(id: BundleId): Promise<Bundle | null> {
    const entity = await this.repository.findOne({
      where: { id: id.getValue() },
    });
    return entity ? BundleMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Bundle[]> {
    const entities = await this.repository.find({
      order: { createdAt: 'DESC' },
    });
    return entities.map((e) => BundleMapper.toDomain(e));
  }

  async findPaginated(
    params: PaginationParams,
  ): Promise<PaginatedResult<Bundle>> {
    const { page, limit } = params;
    const [entities, total] = await this.repository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return buildPaginatedResult(
      entities.map((e) => BundleMapper.toDomain(e)),
      total,
      page,
      limit,
    );
  }

  async findPaginatedWithRelations(
    params: PaginationParams,
  ): Promise<PaginatedResult<BundleWithRelations>> {
    const { page, limit } = params;
    const [entities, total] = await this.repository.findAndCount({
      relations: ['product', 'supplier'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    const data = entities.map((e) => ({
      bundle: BundleMapper.toDomain(e),
      productName: e.product?.name ?? '',
      supplierName: e.supplier?.name ?? '',
    }));
    return buildPaginatedResult(data, total, page, limit);
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}
