import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  IGeneralPaymentRepository,
  GeneralPaymentFilters,
} from '../../../../domain/repositories/general-payment.repository';
import { GeneralPayment } from '../../../../domain/entities/general-payment';
import { PaymentType } from '../../../../domain/enums/payment-type.enum';
import { GeneralPaymentEntity } from '../entities/general-payment.entity';
import { GeneralPaymentMapper } from '../mappers/general-payment.mapper';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import {
  buildPaginatedResult,
  type PaginatedResult,
} from '@shared/domain/pagination/paginated-result.interface';

@Injectable()
export class TypeOrmGeneralPaymentRepository implements IGeneralPaymentRepository {
  constructor(
    @InjectRepository(GeneralPaymentEntity)
    private readonly repo: Repository<GeneralPaymentEntity>,
  ) {}

  async save(payment: GeneralPayment): Promise<void> {
    await this.repo.save(GeneralPaymentMapper.toPersistence(payment));
  }

  async findPaginated(
    filters: GeneralPaymentFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<GeneralPayment>> {
    const { page, limit } = pagination;
    const qb = this.repo.createQueryBuilder('p').where('1=1');

    if (filters.type) {
      qb.andWhere('p.type = :type', { type: filters.type });
    }
    if (filters.category) {
      qb.andWhere('p.category = :category', { category: filters.category });
    }
    if (filters.paymentMethod) {
      qb.andWhere('p.paymentMethod = :paymentMethod', {
        paymentMethod: filters.paymentMethod,
      });
    }
    if (filters.fromDate) {
      qb.andWhere('p.paymentDate >= :fromDate', { fromDate: filters.fromDate });
    }
    if (filters.toDate) {
      qb.andWhere('p.paymentDate <= :toDate', { toDate: filters.toDate });
    }

    qb.orderBy('p.paymentDate', 'DESC')
      .addOrderBy('p.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [entities, total] = await qb.getManyAndCount();
    return buildPaginatedResult(
      entities.map(GeneralPaymentMapper.toDomain),
      total,
      page,
      limit,
    );
  }

  async sumByType(type: PaymentType, fromDate?: Date, toDate?: Date): Promise<number> {
    const qb = this.repo
      .createQueryBuilder('p')
      .select('COALESCE(SUM(p.amount), 0)', 'total')
      .where('p.type = :type', { type });

    if (fromDate) {
      qb.andWhere('p.paymentDate >= :fromDate', { fromDate });
    }
    if (toDate) {
      qb.andWhere('p.paymentDate <= :toDate', { toDate });
    }

    const result = await qb.getRawOne<{ total: string }>();
    return Number(result?.total ?? 0);
  }
}
