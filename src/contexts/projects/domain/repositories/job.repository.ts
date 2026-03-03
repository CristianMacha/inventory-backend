import { Job } from '../entities/job';
import { JobId } from '../value-objects/job-id';
import { JobStatus } from '../enums/job-status.enum';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

export interface JobSearchFilters {
  status?: JobStatus;
  search?: string;
}

export interface JobItemDetails {
  id: string;
  slabId: string;
  slabCode: string;
  productName: string;
  description: string;
  unitPrice: number;
  totalPrice: number;
}

export interface JobWithItemDetails {
  job: Job;
  itemDetails: JobItemDetails[];
}

export interface IJobRepository {
  save(job: Job): Promise<void>;
  removeItem(itemId: string): Promise<void>;
  findById(id: JobId): Promise<Job | null>;
  findByIdWithItemDetails(id: JobId): Promise<JobWithItemDetails | null>;
  findPaginated(
    filters: JobSearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Job>>;
  count(): Promise<number>;
}
