import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import {
  IJobRepository,
  JobItemDetails,
  JobSearchFilters,
  JobWithItemDetails,
} from '../../../../domain/repositories/job.repository';
import { Job } from '../../../../domain/entities/job';
import { JobId } from '../../../../domain/value-objects/job-id';
import { JobEntity } from '../entities/job.entity';
import { JobItemEntity } from '../entities/job-item.entity';
import { JobMapper } from '../mappers/job.mapper';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import {
  buildPaginatedResult,
  type PaginatedResult,
} from '@shared/domain/pagination/paginated-result.interface';

@Injectable()
export class TypeOrmJobRepository implements IJobRepository {
  constructor(
    @InjectRepository(JobEntity)
    private readonly repository: Repository<JobEntity>,
    @InjectRepository(JobItemEntity)
    private readonly itemRepository: Repository<JobItemEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async save(job: Job): Promise<void> {
    const entity = JobMapper.toPersistence(job);
    // Save job scalar fields + upsert items explicitly — do NOT let TypeORM
    // diff the items array via cascade, as it would nullify missing items.
    const { items, ...jobFields } = entity;
    await this.repository.save(jobFields as JobEntity);
    if (items && items.length > 0) {
      await this.itemRepository.save(items);
    }
  }

  async removeItem(itemId: string): Promise<void> {
    await this.itemRepository.delete({ id: itemId });
  }

  async findById(id: JobId): Promise<Job | null> {
    const entity = await this.repository.findOne({
      where: { id: id.getValue() },
      relations: ['items'],
    });
    return entity ? JobMapper.toDomain(entity) : null;
  }

  async findByIdWithItemDetails(
    id: JobId,
  ): Promise<JobWithItemDetails | null> {
    const entity = await this.repository.findOne({
      where: { id: id.getValue() },
      relations: ['items'],
    });
    if (!entity) return null;

    const job = JobMapper.toDomain(entity);

    if (entity.items.length === 0) {
      return { job, itemDetails: [] };
    }

    const slabIds = entity.items.map((i) => i.slabId);

    const rows = await this.dataSource
      .createQueryBuilder()
      .select('s.id', 'slabId')
      .addSelect('s.code', 'slabCode')
      .addSelect('p.name', 'productName')
      .from('slabs', 's')
      .innerJoin('bundles', 'b', 'b.id = s.bundleId')
      .innerJoin('products', 'p', 'p.id = b.productId')
      .where('s.id IN (:...slabIds)', { slabIds })
      .getRawMany<{ slabId: string; slabCode: string; productName: string }>();

    const slabInfoMap = new Map(rows.map((r) => [r.slabId, r]));

    const itemDetails: JobItemDetails[] = entity.items.map((item) => {
      const info = slabInfoMap.get(item.slabId);
      return {
        id: item.id,
        slabId: item.slabId,
        slabCode: info?.slabCode ?? '',
        productName: info?.productName ?? '',
        description: item.description,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
      };
    });

    return { job, itemDetails };
  }

  async findPaginated(
    filters: JobSearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Job>> {
    const { page, limit } = pagination;
    const qb = this.repository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.items', 'items');

    if (filters.status) {
      qb.andWhere('job.status = :status', { status: filters.status });
    }

    if (filters.search) {
      qb.andWhere(
        '(job.projectName LIKE :search OR job.clientName LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    qb.orderBy('job.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [entities, total] = await qb.getManyAndCount();
    return buildPaginatedResult(
      entities.map((e) => JobMapper.toDomain(e)),
      total,
      page,
      limit,
    );
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}
