import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { CancelJobCommand } from './cancel-job.command';
import { IJobRepository } from '../../../domain/repositories/job.repository';
import { JobId } from '../../../domain/value-objects/job-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { PROJECTS_TOKENS } from '../../projects.tokens';

@CommandHandler(CancelJobCommand)
export class CancelJobHandler implements ICommandHandler<CancelJobCommand> {
  constructor(
    @Inject(PROJECTS_TOKENS.JOB_REPOSITORY)
    private readonly jobRepository: IJobRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CancelJobCommand): Promise<void> {
    const { jobId, userId } = command;

    const job = await this.jobRepository.findById(JobId.create(jobId));
    if (!job) {
      throw new ResourceNotFoundException('Job', jobId);
    }

    job.cancel(userId);
    await this.jobRepository.save(job);
    this.eventBus.publishAll(job.getUncommittedEvents());
    job.commit();
  }
}
