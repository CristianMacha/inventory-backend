import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetJobsQuery } from './get-jobs.query';
import { IJobRepository } from '../../../domain/repositories/job.repository';
import { JobOutputDto } from '../../dtos/job-output.dto';
import { JobResponseMapper } from '../../mappers/job-response.mapper';
import { PROJECTS_TOKENS } from '../../projects.tokens';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

@QueryHandler(GetJobsQuery)
export class GetJobsHandler implements IQueryHandler<GetJobsQuery> {
  constructor(
    @Inject(PROJECTS_TOKENS.JOB_REPOSITORY)
    private readonly jobRepository: IJobRepository,
  ) {}

  async execute(query: GetJobsQuery): Promise<PaginatedResult<JobOutputDto>> {
    const result = await this.jobRepository.findPaginated(
      { status: query.status, search: query.search },
      query.pagination,
    );
    return {
      ...result,
      data: result.data.map((job) => JobResponseMapper.toResponse(job)),
    };
  }
}
