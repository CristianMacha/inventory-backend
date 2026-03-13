import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  IInvoicePaymentRepository,
  InvoicePaymentFilters,
  InvoicePaymentWithContext,
} from '../../../../domain/repositories/invoice-payment.repository';
import { InvoicePayment } from '../../../../domain/entities/invoice-payment';
import { InvoicePaymentEntity } from '../entities/invoice-payment.entity';
import { InvoicePaymentMapper } from '../mappers/invoice-payment.mapper';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import {
  buildPaginatedResult,
  type PaginatedResult,
} from '@shared/domain/pagination/paginated-result.interface';

@Injectable()
export class TypeOrmInvoicePaymentRepository implements IInvoicePaymentRepository {
  constructor(
    @InjectRepository(InvoicePaymentEntity)
    private readonly repo: Repository<InvoicePaymentEntity>,
  ) {}

  async save(payment: InvoicePayment): Promise<void> {
    await this.repo.save(InvoicePaymentMapper.toPersistence(payment));
  }

  async findByInvoiceId(invoiceId: string): Promise<InvoicePayment[]> {
    const entities = await this.repo.find({
      where: { invoiceId },
      order: { paymentDate: 'ASC', createdAt: 'ASC' },
    });
    return entities.map((e) => InvoicePaymentMapper.toDomain(e));
  }

  async findPaginated(
    filters: InvoicePaymentFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<InvoicePayment>> {
    const { page, limit } = pagination;
    const qb = this.repo.createQueryBuilder('p').where('1=1');

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
      entities.map((e) => InvoicePaymentMapper.toDomain(e)),
      total,
      page,
      limit,
    );
  }

  async findPaginatedWithContext(
    filters: InvoicePaymentFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<InvoicePaymentWithContext>> {
    const { page, limit } = pagination;
    const qb = this.repo
      .createQueryBuilder('p')
      .innerJoin('purchase_invoices', 'i', 'i.id = p.invoiceId')
      .select([
        'p.id AS id',
        'p.invoiceId AS invoiceId',
        'i.invoiceNumber AS invoiceNumber',
        'p.amount AS amount',
        'p.paymentMethod AS paymentMethod',
        'p.paymentDate AS paymentDate',
        'p.reference AS reference',
        'p.createdBy AS createdBy',
        'p.createdAt AS createdAt',
      ]);

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

    const total = await qb.getCount();

    qb.orderBy('p.paymentDate', 'DESC')
      .addOrderBy('p.createdAt', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit);

    const rows = await qb.getRawMany<{
      id: string;
      invoiceId: string;
      invoiceNumber: string;
      amount: string;
      paymentMethod: string;
      paymentDate: string;
      reference: string | null;
      createdBy: string;
      createdAt: string;
    }>();

    const data: InvoicePaymentWithContext[] = rows.map((r) => ({
      id: r.id,
      invoiceId: r.invoiceId,
      invoiceNumber: r.invoiceNumber,
      amount: Number(r.amount),
      paymentMethod:
        r.paymentMethod as InvoicePaymentWithContext['paymentMethod'],
      paymentDate: new Date(r.paymentDate),
      reference: r.reference,
      createdBy: r.createdBy,
      createdAt: new Date(r.createdAt),
    }));

    return buildPaginatedResult(data, total, page, limit);
  }

  async sumByInvoiceId(invoiceId: string): Promise<number> {
    const result = await this.repo
      .createQueryBuilder('p')
      .select('COALESCE(SUM(p.amount), 0)', 'total')
      .where('p.invoiceId = :invoiceId', { invoiceId })
      .getRawOne<{ total: string }>();
    return Number(result?.total ?? 0);
  }

  async sumAll(fromDate?: Date, toDate?: Date): Promise<number> {
    const qb = this.repo
      .createQueryBuilder('p')
      .select('COALESCE(SUM(p.amount), 0)', 'total');

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
