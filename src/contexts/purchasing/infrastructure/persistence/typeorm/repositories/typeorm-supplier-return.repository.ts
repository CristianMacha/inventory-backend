import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  ISupplierReturnRepository,
  SupplierReturnSearchFilters,
} from '../../../../domain/repositories/supplier-return.repository';
import { SupplierReturn } from '../../../../domain/entities/supplier-return';
import { SupplierReturnId } from '../../../../domain/value-objects/supplier-return-id';
import { SupplierReturnEntity } from '../entities/supplier-return.entity';
import { SupplierReturnItemEntity } from '../entities/supplier-return-item.entity';
import { SupplierReturnMapper } from '../mappers/supplier-return.mapper';
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

  async findPaginated(
    filters: SupplierReturnSearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<SupplierReturn>> {
    const { page, limit } = pagination;
    const qb = this.repository
      .createQueryBuilder('ret')
      .leftJoinAndSelect('ret.items', 'items');

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
    return buildPaginatedResult(
      entities.map((e) => SupplierReturnMapper.toDomain(e)),
      total,
      page,
      limit,
    );
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}
