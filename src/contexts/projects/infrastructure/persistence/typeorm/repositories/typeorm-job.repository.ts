import { Injectable, Inject } from '@nestjs/common';
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
import { ISlabRepository } from '@contexts/inventory/domain/repositories/slab.repository';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@Injectable()
export class TypeOrmJobRepository implements IJobRepository {
  constructor(
    @InjectRepository(JobEntity)
    private readonly repository: Repository<JobEntity>,
    @InjectRepository(JobItemEntity)
    private readonly itemRepository: Repository<JobItemEntity>,
    private readonly dataSource: DataSource,
    @Inject(INVENTORY_TOKENS.SLAB_REPOSITORY)
    private readonly slabRepository: ISlabRepository,
  ) {}

  async save(job: Job): Promise<void> {
    const entity = JobMapper.toPersistence(job);
    // Save job scalar fields + upsert items explicitly in a single transaction.
    // Do NOT let TypeORM diff the items array via cascade, as it would nullify missing items.
    const { items, ...jobFields } = entity;
    await this.dataSource.transaction(async (manager) => {
      await manager.save(JobEntity, jobFields as JobEntity);
      if (items && items.length > 0) {
        await manager.save(JobItemEntity, items);
      }
    });
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

  async findByIdWithItemDetails(id: JobId): Promise<JobWithItemDetails | null> {
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

    const slabInfoList = await this.slabRepository.findSlabInfoByIds(slabIds);
    const slabInfoMap = new Map(slabInfoList.map((r) => [r.slabId, r]));

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
      .loadRelationCountAndMap('job.itemCount', 'job.items');

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
      entities.map((e) => JobMapper.toDomainWithCount(e as JobEntity & { itemCount?: number })),
      total,
      page,
      limit,
    );
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}
