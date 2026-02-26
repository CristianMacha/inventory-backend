import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  IJobRepository,
  JobSearchFilters,
} from '../../../../domain/repositories/job.repository';
import { Job } from '../../../../domain/entities/job';
import { JobId } from '../../../../domain/value-objects/job-id';
import { JobEntity } from '../entities/job.entity';
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
  ) {}

  async save(job: Job): Promise<void> {
    const entity = JobMapper.toPersistence(job);
    await this.repository.save(entity);
  }

  async findById(id: JobId): Promise<Job | null> {
    const entity = await this.repository.findOne({
      where: { id: id.getValue() },
      relations: ['items'],
    });
    return entity ? JobMapper.toDomain(entity) : null;
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
