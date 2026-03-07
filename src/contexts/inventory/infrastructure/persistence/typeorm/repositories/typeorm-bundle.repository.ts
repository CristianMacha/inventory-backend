import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PurchaseInvoiceEntity } from '@contexts/purchasing/infrastructure/persistence/typeorm/entities/purchase-invoice.entity';

import {
  IBundleRepository,
  BundleFilters,
  BundleSelectFilters,
  BundleWithRelations,
  BundleWithSlabs,
  BundleWithProductName,
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

  async findByIdWithSlabs(id: BundleId): Promise<BundleWithSlabs | null> {
    const entity = await this.repository
      .createQueryBuilder('bundle')
      .leftJoinAndSelect('bundle.slabs', 'slabs')
      .leftJoinAndSelect('bundle.supplier', 'supplier')
      .leftJoinAndSelect('bundle.product', 'product')
      .leftJoinAndMapOne(
        'bundle.invoice',
        PurchaseInvoiceEntity,
        'invoice',
        'invoice.id = bundle.purchaseInvoiceId',
      )
      .where('bundle.id = :id', { id: id.getValue() })
      .getOne();

    if (!entity) return null;

    return {
      bundle: BundleMapper.toDomain(entity),
      slabs: (entity.slabs ?? []).map((s) => SlabMapper.toDomain(s)),
      productName: entity.product?.name ?? '',
      supplierName: entity.supplier?.name ?? '',
      invoiceNumber: (entity as any).invoice?.invoiceNumber ?? null,
    };
  }

  async findByProductIdWithSlabs(
    productId: string,
  ): Promise<BundleWithSlabs[]> {
    const entities = await this.repository
      .createQueryBuilder('bundle')
      .leftJoinAndSelect('bundle.slabs', 'slabs')
      .leftJoinAndSelect('bundle.supplier', 'supplier')
      .leftJoinAndSelect('bundle.product', 'product')
      .leftJoinAndMapOne(
        'bundle.invoice',
        PurchaseInvoiceEntity,
        'invoice',
        'invoice.id = bundle.purchaseInvoiceId',
      )
      .where('bundle.productId = :productId', { productId })
      .orderBy('bundle.createdAt', 'DESC')
      .getMany();

    return entities.map((e) => ({
      bundle: BundleMapper.toDomain(e),
      slabs: (e.slabs ?? []).map((s) => SlabMapper.toDomain(s)),
      productName: e.product?.name ?? '',
      supplierName: e.supplier?.name ?? '',
      invoiceNumber: (e as any).invoice?.invoiceNumber ?? null,
    }));
  }

  async findAvailableByProductId(
    productId: string,
  ): Promise<BundleWithSlabs[]> {
    const entities = await this.repository
      .createQueryBuilder('bundle')
      .innerJoinAndSelect(
        'bundle.slabs',
        'slabs',
        "slabs.status = 'AVAILABLE'",
      )
      .leftJoinAndSelect('bundle.supplier', 'supplier')
      .leftJoinAndSelect('bundle.product', 'product')
      .leftJoinAndMapOne(
        'bundle.invoice',
        PurchaseInvoiceEntity,
        'invoice',
        'invoice.id = bundle.purchaseInvoiceId',
      )
      .where('bundle.productId = :productId', { productId })
      .orderBy('bundle.createdAt', 'DESC')
      .getMany();

    return entities.map((e) => ({
      bundle: BundleMapper.toDomain(e),
      slabs: (e.slabs ?? []).map((s) => SlabMapper.toDomain(s)),
      productName: e.product?.name ?? '',
      supplierName: e.supplier?.name ?? '',
      invoiceNumber: (e as any).invoice?.invoiceNumber ?? null,
    }));
  }

  async findById(id: BundleId): Promise<Bundle | null> {
    const entity = await this.repository.findOne({
      where: { id: id.getValue() },
    });
    return entity ? BundleMapper.toDomain(entity) : null;
  }

  async findByIdWithProductName(
    id: BundleId,
  ): Promise<BundleWithProductName | null> {
    const entity = await this.repository.findOne({
      where: { id: id.getValue() },
      relations: ['product'],
    });
    if (!entity) return null;
    return {
      bundle: BundleMapper.toDomain(entity),
      productName: entity.product?.name ?? '',
    };
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
    filters?: BundleFilters,
  ): Promise<PaginatedResult<BundleWithRelations>> {
    const { page, limit } = params;
    const qb = this.repository
      .createQueryBuilder('bundle')
      .leftJoinAndSelect('bundle.product', 'product')
      .leftJoinAndSelect('bundle.supplier', 'supplier')
      .leftJoinAndMapOne(
        'bundle.invoice',
        PurchaseInvoiceEntity,
        'invoice',
        'invoice.id = bundle.purchaseInvoiceId',
      )
      .orderBy('bundle.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (filters?.productId) {
      qb.andWhere('bundle.productId = :productId', {
        productId: filters.productId,
      });
    }
    if (filters?.supplierId) {
      qb.andWhere('bundle.supplierId = :supplierId', {
        supplierId: filters.supplierId,
      });
    }
    if (filters?.search) {
      qb.andWhere('bundle.lotNumber LIKE :search', {
        search: `%${filters.search}%`,
      });
    }

    const [entities, total] = await qb.getManyAndCount();
    const data = entities.map((e) => ({
      bundle: BundleMapper.toDomain(e),
      productName: e.product?.name ?? '',
      supplierName: e.supplier?.name ?? '',
      invoiceNumber: (e as any).invoice?.invoiceNumber ?? null,
    }));
    return buildPaginatedResult(data, total, page, limit);
  }

  async findForSelect(filters: BundleSelectFilters): Promise<BundleWithRelations[]> {
    const qb = this.repository
      .createQueryBuilder('bundle')
      .leftJoinAndSelect('bundle.product', 'product')
      .leftJoinAndSelect('bundle.supplier', 'supplier')
      .leftJoinAndMapOne(
        'bundle.invoice',
        PurchaseInvoiceEntity,
        'invoice',
        'invoice.id = bundle.purchaseInvoiceId',
      )
      .orderBy('bundle.lotNumber', 'ASC');

    if (filters.supplierId) {
      qb.andWhere('bundle.supplierId = :supplierId', { supplierId: filters.supplierId });
    }

    if (filters.unlinked) {
      qb.andWhere('bundle.purchaseInvoiceId IS NULL');
    }

    const entities = await qb.getMany();
    return entities.map((e) => ({
      bundle: BundleMapper.toDomain(e),
      productName: e.product?.name ?? '',
      supplierName: e.supplier?.name ?? '',
      invoiceNumber: (e as any).invoice?.invoiceNumber ?? null,
    }));
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}
