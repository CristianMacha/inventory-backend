import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetJobByIdQuery } from './get-job-by-id.query';
import { IJobRepository } from '../../../domain/repositories/job.repository';
import { JobId } from '../../../domain/value-objects/job-id';
import { JobDetailOutputDto } from '../../dtos/job-output.dto';
import { JobResponseMapper } from '../../mappers/job-response.mapper';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { PROJECTS_TOKENS } from '../../projects.tokens';

@QueryHandler(GetJobByIdQuery)
export class GetJobByIdHandler implements IQueryHandler<GetJobByIdQuery> {
  constructor(
    @Inject(PROJECTS_TOKENS.JOB_REPOSITORY)
    private readonly jobRepository: IJobRepository,
  ) {}

  async execute(query: GetJobByIdQuery): Promise<JobDetailOutputDto> {
    const job = await this.jobRepository.findById(JobId.create(query.id));
    if (!job) {
      throw new ResourceNotFoundException('Job', query.id);
    }
    return JobResponseMapper.toDetailResponse(job);
  }
}
