import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { JobPaymentRecordedEvent } from '@contexts/accounting/domain/events/job-payment-recorded.event';
import { IJobRepository } from '../../domain/repositories/job.repository';
import { JobId } from '../../domain/value-objects/job-id';
import { PROJECTS_TOKENS } from '../projects.tokens';

@EventsHandler(JobPaymentRecordedEvent)
export class OnJobPaymentRecordedHandler implements IEventHandler<JobPaymentRecordedEvent> {
  constructor(
    @Inject(PROJECTS_TOKENS.JOB_REPOSITORY)
    private readonly jobRepository: IJobRepository,
  ) {}

  async handle(event: JobPaymentRecordedEvent): Promise<void> {
    const { jobId, paymentAmount, userId } = event;

    const job = await this.jobRepository.findById(JobId.create(jobId));
    if (!job) return;

    job.applyPayment(paymentAmount, userId);
    await this.jobRepository.save(job);
  }
}
