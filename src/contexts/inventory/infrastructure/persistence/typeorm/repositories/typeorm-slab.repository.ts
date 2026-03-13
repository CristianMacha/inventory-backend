import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  ISlabRepository,
  SlabFilters,
  SlabJobInfo,
  ReturnableSlabWithBundle,
} from '@contexts/inventory/domain/repositories/slab.repository';
import { Slab } from '@contexts/inventory/domain/entities/slab';
import { SlabId } from '@contexts/inventory/domain/value-objects/slab-id';
import { BundleId } from '@contexts/inventory/domain/value-objects/bundle-id';
import { SlabStatus } from '@contexts/inventory/domain/enums/slab-status.enum';
import { SlabEntity } from '../entities/slab.entity';
import { BundleEntity } from '../entities/bundle.entity';
import { SlabMapper } from '../mappers/slab.mapper';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import {
  buildPaginatedResult,
  type PaginatedResult,
} from '@shared/domain/pagination/paginated-result.interface';

@Injectable()
export class TypeOrmSlabRepository implements ISlabRepository {
  constructor(
    @InjectRepository(SlabEntity)
    private readonly repository: Repository<SlabEntity>,
  ) {}

  async save(slab: Slab): Promise<void> {
    const entity = SlabMapper.toPersistence(slab);
    await this.repository.save(entity);
  }

  async saveMany(slabs: Slab[]): Promise<void> {
    const entities = slabs.map((s) => SlabMapper.toPersistence(s));
    await this.repository.save(entities);
  }

  async findByIds(ids: string[]): Promise<Slab[]> {
    if (ids.length === 0) return [];
    const entities = await this.repository.findByIds(ids);
    return entities.map((e) => SlabMapper.toDomain(e));
  }

  async findSlabInfoByIds(ids: string[]): Promise<SlabJobInfo[]> {
    if (ids.length === 0) return [];
    return this.repository
      .createQueryBuilder('s')
      .select('s.id', 'slabId')
      .addSelect('s.code', 'slabCode')
      .addSelect('p.name', 'productName')
      .innerJoin('bundles', 'b', 'b.id = s.bundleId')
      .innerJoin('products', 'p', 'p.id = b.productId')
      .where('s.id IN (:...ids)', { ids })
      .getRawMany<SlabJobInfo>();
  }

  async findById(id: SlabId): Promise<Slab | null> {
    const entity = await this.repository.findOne({
      where: { id: id.getValue() },
    });
    return entity ? SlabMapper.toDomain(entity) : null;
  }

  async findByBundleId(bundleId: BundleId): Promise<Slab[]> {
    const entities = await this.repository.find({
      where: { bundleId: bundleId.getValue() },
    });
    return entities.map((e) => SlabMapper.toDomain(e));
  }

  async findAll(): Promise<Slab[]> {
    const entities = await this.repository.find({
      order: { createdAt: 'DESC' },
    });
    return entities.map((e) => SlabMapper.toDomain(e));
  }

  async findPaginated(
    params: PaginationParams,
    filters?: SlabFilters,
  ): Promise<PaginatedResult<Slab>> {
    const { page, limit } = params;
    const qb = this.repository.createQueryBuilder('s').where('1=1');

    if (filters?.bundleId) {
      qb.andWhere('s.bundleId = :bundleId', { bundleId: filters.bundleId });
    }
    if (filters?.status) {
      qb.andWhere('s.status = :status', { status: filters.status });
    }
    if (filters?.search) {
      qb.andWhere('s.code LIKE :search', { search: `%${filters.search}%` });
    }
    if (filters?.isRemnant === true) {
      qb.andWhere('s.parentSlabId IS NOT NULL');
    } else if (filters?.isRemnant === false) {
      qb.andWhere('s.parentSlabId IS NULL');
    }

    qb.orderBy('s.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [entities, total] = await qb.getManyAndCount();
    return buildPaginatedResult(
      entities.map((e) => SlabMapper.toDomain(e)),
      total,
      page,
      limit,
    );
  }

  async findReturnable(filters: {
    purchaseInvoiceId: string;
    bundleId?: string;
  }): Promise<ReturnableSlabWithBundle[]> {
    const qb = this.repository
      .createQueryBuilder('slab')
      .innerJoin(BundleEntity, 'bundle', 'bundle.id = slab.bundleId')
      .addSelect('bundle.lotNumber', 'bundle_lotNumber')
      .where('bundle.purchaseInvoiceId = :purchaseInvoiceId', {
        purchaseInvoiceId: filters.purchaseInvoiceId,
      })
      .andWhere('slab.status IN (:...statuses)', {
        statuses: [SlabStatus.AVAILABLE, SlabStatus.RESERVED],
      })
      .orderBy('bundle.lotNumber', 'ASC')
      .addOrderBy('slab.code', 'ASC');

    if (filters.bundleId) {
      qb.andWhere('slab.bundleId = :bundleId', { bundleId: filters.bundleId });
    }

    const raw = await qb.getRawAndEntities();
    const rawRows = raw.raw as { bundle_lotNumber: string }[];

    return raw.entities.map((entity, i) => ({
      slab: SlabMapper.toDomain(entity),
      lotNumber: rawRows[i]?.bundle_lotNumber ?? '',
    }));
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}
