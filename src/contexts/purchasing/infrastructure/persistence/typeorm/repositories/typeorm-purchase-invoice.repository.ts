import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import {
  IPurchaseInvoiceRepository,
  PurchaseInvoiceSearchFilters,
  PurchaseInvoiceWithSupplier,
  BundleCostSummary,
  InvoiceItemWithBundleInfo,
} from '../../../../domain/repositories/purchase-invoice.repository';
import { PurchaseInvoice } from '../../../../domain/entities/purchase-invoice';
import { PurchaseInvoiceId } from '../../../../domain/value-objects/purchase-invoice-id';
import { PurchaseInvoiceStatus } from '../../../../domain/enums/purchase-invoice-status.enum';
import { PurchaseInvoiceEntity } from '../entities/purchase-invoice.entity';
import { PurchaseInvoiceItemEntity } from '../entities/purchase-invoice-item.entity';
import { PurchaseInvoiceMapper } from '../mappers/purchase-invoice.mapper';
import { SupplierEntity } from '@contexts/inventory/infrastructure/persistence/typeorm/entities/supplier.entity';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import {
  buildPaginatedResult,
  type PaginatedResult,
} from '@shared/domain/pagination/paginated-result.interface';

@Injectable()
export class TypeOrmPurchaseInvoiceRepository implements IPurchaseInvoiceRepository {
  constructor(
    @InjectRepository(PurchaseInvoiceEntity)
    private readonly repository: Repository<PurchaseInvoiceEntity>,
    @InjectRepository(PurchaseInvoiceItemEntity)
    private readonly itemRepository: Repository<PurchaseInvoiceItemEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async save(invoice: PurchaseInvoice): Promise<void> {
    const entity = PurchaseInvoiceMapper.toPersistence(invoice);
    await this.repository.save(entity);
  }

  async deleteItem(itemId: string): Promise<void> {
    await this.itemRepository.delete(itemId);
  }

  async findById(id: PurchaseInvoiceId): Promise<PurchaseInvoice | null> {
    const entity = await this.repository.findOne({
      where: { id: id.getValue() },
      relations: ['items'],
    });
    return entity ? PurchaseInvoiceMapper.toDomain(entity) : null;
  }

  async findByIdWithSupplier(
    id: PurchaseInvoiceId,
  ): Promise<PurchaseInvoiceWithSupplier | null> {
    const entity = await this.repository
      .createQueryBuilder('invoice')
      .leftJoinAndMapOne(
        'invoice.supplier',
        SupplierEntity,
        'supplier',
        'supplier.id = invoice.supplierId',
      )
      .leftJoinAndSelect('invoice.items', 'items')
      .where('invoice.id = :id', { id: id.getValue() })
      .getOne();

    if (!entity) return null;
    return {
      invoice: PurchaseInvoiceMapper.toDomain(entity),
      supplierName: (entity as any).supplier?.name ?? '',
    };
  }

  async findByInvoiceNumber(
    invoiceNumber: string,
  ): Promise<PurchaseInvoice | null> {
    const entity = await this.repository.findOne({
      where: { invoiceNumber },
    });
    if (!entity) return null;
    entity.items = [];
    return PurchaseInvoiceMapper.toDomain(entity);
  }

  async findPaginated(
    filters: PurchaseInvoiceSearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<PurchaseInvoiceWithSupplier>> {
    const { page, limit } = pagination;
    const qb = this.repository
      .createQueryBuilder('invoice')
      .loadRelationCountAndMap('invoice.itemCount', 'invoice.items')
      .leftJoinAndMapOne(
        'invoice.supplier',
        SupplierEntity,
        'supplier',
        'supplier.id = invoice.supplierId',
      );

    if (filters.supplierId) {
      qb.andWhere('invoice.supplierId = :supplierId', {
        supplierId: filters.supplierId,
      });
    }

    if (filters.status) {
      qb.andWhere('invoice.status = :status', { status: filters.status });
    }

    if (filters.search) {
      qb.andWhere('invoice.invoiceNumber LIKE :search', {
        search: `%${filters.search}%`,
      });
    }

    qb.orderBy('invoice.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [entities, total] = await qb.getManyAndCount();
    return buildPaginatedResult(
      entities.map((e) => ({
        invoice: PurchaseInvoiceMapper.toDomainWithCount(e),
        supplierName: (e as any).supplier?.name ?? '',
      })),
      total,
      page,
      limit,
    );
  }

  async getBundleCostSummary(
    bundleId: string,
  ): Promise<BundleCostSummary | null> {
    const items = await this.itemRepository.find({
      where: { bundleId },
    });

    if (items.length === 0) return null;

    const breakdown: { concept: string; total: number }[] = [];
    let totalCost = 0;

    const grouped = new Map<string, number>();
    for (const item of items) {
      const cost = Number(item.totalCost);
      totalCost += cost;
      grouped.set(item.concept, (grouped.get(item.concept) ?? 0) + cost);
    }

    for (const [concept, total] of grouped) {
      breakdown.push({ concept, total });
    }

    return { bundleId, totalCost, breakdown };
  }

  async findItemsWithBundleInfo(
    invoiceId: string,
  ): Promise<InvoiceItemWithBundleInfo[]> {
    const items = await this.itemRepository.find({
      where: { purchaseInvoiceId: invoiceId },
    });

    return items.map((item) => ({
      id: item.id,
      bundleId: item.bundleId,
      concept: item.concept,
      description: item.description ?? '',
      unitCost: Number(item.unitCost),
      quantity: Number(item.quantity),
      totalCost: Number(item.totalCost),
    }));
  }

  async findForSelect(filters: {
    supplierId?: string;
    status?: PurchaseInvoiceStatus;
  }): Promise<PurchaseInvoice[]> {
    const qb = this.repository.createQueryBuilder('invoice');

    if (filters.supplierId) {
      qb.andWhere('invoice.supplierId = :supplierId', {
        supplierId: filters.supplierId,
      });
    }

    if (filters.status) {
      qb.andWhere('invoice.status = :status', { status: filters.status });
    } else {
      qb.andWhere('invoice.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: [
          PurchaseInvoiceStatus.DRAFT,
          PurchaseInvoiceStatus.CANCELLED,
        ],
      });
    }

    qb.orderBy('invoice.invoiceDate', 'DESC');

    const entities = await qb.getMany();
    return entities.map((e) => PurchaseInvoiceMapper.toDomain(e));
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}
