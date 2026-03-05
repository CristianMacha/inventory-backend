import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { ListJobPaymentsQuery } from './list-job-payments.query';
import { JobPaymentsPageDto } from '../../dtos/job-payment-output.dto';
import { ACCOUNTING_TOKENS } from '../../accounting.tokens';
import {
  IJobPaymentRepository,
  JobPaymentWithContext,
} from '../../../domain/repositories/job-payment.repository';

@QueryHandler(ListJobPaymentsQuery)
export class ListJobPaymentsHandler
  implements IQueryHandler<ListJobPaymentsQuery>
{
  constructor(
    @Inject(ACCOUNTING_TOKENS.JOB_PAYMENT_REPOSITORY)
    private readonly jobPaymentRepository: IJobPaymentRepository,
  ) {}

  async execute(query: ListJobPaymentsQuery): Promise<JobPaymentsPageDto> {
    const { pagination, paymentMethod, fromDate, toDate } = query;

    const result = await this.jobPaymentRepository.findPaginatedWithContext(
      { paymentMethod, fromDate, toDate },
      pagination,
    );

    return {
      payments: result.data.map((p: JobPaymentWithContext) => ({
        id: p.id,
        jobId: p.jobId,
        projectName: p.projectName,
        amount: p.amount,
        paymentMethod: p.paymentMethod,
        paymentDate: p.paymentDate.toISOString().split('T')[0],
        reference: p.reference,
        createdBy: p.createdBy,
        createdAt: p.createdAt.toISOString(),
      })),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
}
