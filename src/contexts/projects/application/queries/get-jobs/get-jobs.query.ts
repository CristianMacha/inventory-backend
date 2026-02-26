import { JobStatus } from '../../../domain/enums/job-status.enum';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

export class GetJobsQuery {
  constructor(
    public readonly pagination: PaginationParams,
    public readonly status?: JobStatus,
    public readonly search?: string,
  ) {}
}
