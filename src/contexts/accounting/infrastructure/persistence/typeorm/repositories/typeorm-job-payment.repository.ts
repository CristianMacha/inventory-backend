import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  IJobPaymentRepository,
  JobPaymentFilters,
  JobPaymentWithContext,
} from '../../../../domain/repositories/job-payment.repository';
import { JobPayment } from '../../../../domain/entities/job-payment';
import { JobPaymentEntity } from '../entities/job-payment.entity';
import { JobPaymentMapper } from '../mappers/job-payment.mapper';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import {
  buildPaginatedResult,
  type PaginatedResult,
} from '@shared/domain/pagination/paginated-result.interface';

@Injectable()
export class TypeOrmJobPaymentRepository implements IJobPaymentRepository {
  constructor(
    @InjectRepository(JobPaymentEntity)
    private readonly repo: Repository<JobPaymentEntity>,
  ) {}

  async save(payment: JobPayment): Promise<void> {
    await this.repo.save(JobPaymentMapper.toPersistence(payment));
  }

  async findByJobId(jobId: string): Promise<JobPayment[]> {
    const entities = await this.repo.find({
      where: { jobId },
      order: { paymentDate: 'ASC', createdAt: 'ASC' },
    });
    return entities.map((e) => JobPaymentMapper.toDomain(e));
  }

  async findPaginated(
    filters: JobPaymentFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<JobPayment>> {
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
      entities.map((e) => JobPaymentMapper.toDomain(e)),
      total,
      page,
      limit,
    );
  }

  async findPaginatedWithContext(
    filters: JobPaymentFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<JobPaymentWithContext>> {
    const { page, limit } = pagination;
    const qb = this.repo
      .createQueryBuilder('p')
      .innerJoin('jobs', 'j', 'j.id = p.jobId')
      .select([
        'p.id AS id',
        'p.jobId AS jobId',
        'j.projectName AS projectName',
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
      jobId: string;
      projectName: string;
      amount: string;
      paymentMethod: string;
      paymentDate: string;
      reference: string | null;
      createdBy: string;
      createdAt: string;
    }>();

    const data: JobPaymentWithContext[] = rows.map((r) => ({
      id: r.id,
      jobId: r.jobId,
      projectName: r.projectName,
      amount: Number(r.amount),
      paymentMethod: r.paymentMethod as JobPaymentWithContext['paymentMethod'],
      paymentDate: new Date(r.paymentDate),
      reference: r.reference,
      createdBy: r.createdBy,
      createdAt: new Date(r.createdAt),
    }));

    return buildPaginatedResult(data, total, page, limit);
  }

  async sumByJobId(jobId: string): Promise<number> {
    const result = await this.repo
      .createQueryBuilder('p')
      .select('COALESCE(SUM(p.amount), 0)', 'total')
      .where('p.jobId = :jobId', { jobId })
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
