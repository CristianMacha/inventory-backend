import { Job } from '../entities/job';
import { JobId } from '../value-objects/job-id';
import { JobStatus } from '../enums/job-status.enum';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

export interface JobSearchFilters {
  status?: JobStatus;
  search?: string;
}

export interface IJobRepository {
  save(job: Job): Promise<void>;
  findById(id: JobId): Promise<Job | null>;
  findPaginated(
    filters: JobSearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Job>>;
  count(): Promise<number>;
}
