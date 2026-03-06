import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import {
  ISupplierReturnRepository,
  SupplierReturnSearchFilters,
  SupplierReturnWithRelations,
} from '../../../../domain/repositories/supplier-return.repository';
import { SupplierReturnStatus } from '../../../../domain/enums/supplier-return-status.enum';
import { SupplierReturn } from '../../../../domain/entities/supplier-return';
import { SupplierReturnId } from '../../../../domain/value-objects/supplier-return-id';
import { SupplierReturnEntity } from '../entities/supplier-return.entity';
import { SupplierReturnItemEntity } from '../entities/supplier-return-item.entity';
import { SupplierReturnMapper } from '../mappers/supplier-return.mapper';
import { PurchaseInvoiceEntity } from '../entities/purchase-invoice.entity';
import { SupplierEntity } from '@contexts/inventory/infrastructure/persistence/typeorm/entities/supplier.entity';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import {
  buildPaginatedResult,
  type PaginatedResult,
} from '@shared/domain/pagination/paginated-result.interface';

@Injectable()
export class TypeOrmSupplierReturnRepository implements ISupplierReturnRepository {
  constructor(
    @InjectRepository(SupplierReturnEntity)
    private readonly repository: Repository<SupplierReturnEntity>,
    @InjectRepository(SupplierReturnItemEntity)
    private readonly itemRepository: Repository<SupplierReturnItemEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async save(supplierReturn: SupplierReturn): Promise<void> {
    const entity = SupplierReturnMapper.toPersistence(supplierReturn);
    await this.repository.save(entity);
  }

  async deleteItem(itemId: string): Promise<void> {
    await this.itemRepository.delete(itemId);
  }

  async findById(id: SupplierReturnId): Promise<SupplierReturn | null> {
    const entity = await this.repository.findOne({
      where: { id: id.getValue() },
      relations: ['items'],
    });
    return entity ? SupplierReturnMapper.toDomain(entity) : null;
  }

  async findByIdWithRelations(
    id: SupplierReturnId,
  ): Promise<SupplierReturnWithRelations | null> {
    const entity = await this.repository.findOne({
      where: { id: id.getValue() },
      relations: ['items'],
    });
    if (!entity) return null;

    const [supplier, invoice] = await Promise.all([
      this.dataSource
        .getRepository(SupplierEntity)
        .findOne({ where: { id: entity.supplierId }, select: ['id', 'name'] }),
      this.dataSource.getRepository(PurchaseInvoiceEntity).findOne({
        where: { id: entity.purchaseInvoiceId },
        select: ['id', 'invoiceNumber'],
      }),
    ]);

    return {
      supplierReturn: SupplierReturnMapper.toDomain(entity),
      supplierName: supplier?.name ?? '',
      invoiceNumber: invoice?.invoiceNumber ?? null,
    };
  }

  async findPaginated(
    filters: SupplierReturnSearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<SupplierReturnWithRelations>> {
    const { page, limit } = pagination;
    const qb = this.repository
      .createQueryBuilder('ret')
      .leftJoinAndSelect('ret.items', 'items')
      .leftJoinAndMapOne(
        'ret.supplier',
        SupplierEntity,
        'supplier',
        'supplier.id = ret.supplierId',
      )
      .leftJoinAndMapOne(
        'ret.invoice',
        PurchaseInvoiceEntity,
        'invoice',
        'invoice.id = ret.purchaseInvoiceId',
      );

    if (filters.supplierId) {
      qb.andWhere('ret.supplierId = :supplierId', {
        supplierId: filters.supplierId,
      });
    }
    if (filters.status) {
      qb.andWhere('ret.status = :status', { status: filters.status });
    }
    if (filters.purchaseInvoiceId) {
      qb.andWhere('ret.purchaseInvoiceId = :purchaseInvoiceId', {
        purchaseInvoiceId: filters.purchaseInvoiceId,
      });
    }

    qb.orderBy('ret.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [entities, total] = await qb.getManyAndCount();
    const data = entities.map((e) => ({
      supplierReturn: SupplierReturnMapper.toDomain(e),
      supplierName: (e as any).supplier?.name ?? '',
      invoiceNumber: (e as any).invoice?.invoiceNumber ?? null,
    }));

    return buildPaginatedResult(data, total, page, limit);
  }

  async findForSelect(
    filters: SupplierReturnSearchFilters,
  ): Promise<SupplierReturn[]> {
    const qb = this.repository.createQueryBuilder('ret');

    if (filters.status) {
      qb.andWhere('ret.status = :status', { status: filters.status });
    } else {
      qb.andWhere('ret.status IN (:...statuses)', {
        statuses: [SupplierReturnStatus.DRAFT, SupplierReturnStatus.SENT],
      });
    }

    if (filters.supplierId) {
      qb.andWhere('ret.supplierId = :supplierId', {
        supplierId: filters.supplierId,
      });
    }

    if (filters.purchaseInvoiceId) {
      qb.andWhere('ret.purchaseInvoiceId = :purchaseInvoiceId', {
        purchaseInvoiceId: filters.purchaseInvoiceId,
      });
    }

    qb.orderBy('ret.returnDate', 'DESC');

    const entities = await qb.getMany();
    return entities.map((e) => SupplierReturnMapper.toDomain(e));
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}
