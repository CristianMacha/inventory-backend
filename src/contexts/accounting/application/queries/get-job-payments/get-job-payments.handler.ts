import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetJobPaymentsQuery } from './get-job-payments.query';
import { JobPaymentsWithSummaryDto } from '../../dtos/job-payment-output.dto';
import { ACCOUNTING_TOKENS } from '../../accounting.tokens';
import { PROJECTS_TOKENS } from '@contexts/projects/application/projects.tokens';
import { IJobPaymentRepository } from '../../../domain/repositories/job-payment.repository';
import { IJobRepository } from '@contexts/projects/domain/repositories/job.repository';
import { JobId } from '@contexts/projects/domain/value-objects/job-id';
import { JobPaymentResponseMapper } from '../../mappers/job-payment-response.mapper';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';

@QueryHandler(GetJobPaymentsQuery)
export class GetJobPaymentsHandler implements IQueryHandler<GetJobPaymentsQuery> {
  constructor(
    @Inject(ACCOUNTING_TOKENS.JOB_PAYMENT_REPOSITORY)
    private readonly jobPaymentRepository: IJobPaymentRepository,
    @Inject(PROJECTS_TOKENS.JOB_REPOSITORY)
    private readonly jobRepository: IJobRepository,
  ) {}

  async execute(
    query: GetJobPaymentsQuery,
  ): Promise<JobPaymentsWithSummaryDto> {
    const { jobId } = query;

    const [job, payments] = await Promise.all([
      this.jobRepository.findById(JobId.create(jobId)),
      this.jobPaymentRepository.findByJobId(jobId),
    ]);

    if (!job) {
      throw new ResourceNotFoundException('Job', jobId);
    }

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const remaining = job.totalAmount - totalPaid;

    return {
      payments: payments.map((e) => JobPaymentResponseMapper.toResponse(e)),
      totalPaid,
      remaining,
      jobTotalAmount: job.totalAmount,
    };
  }
}
