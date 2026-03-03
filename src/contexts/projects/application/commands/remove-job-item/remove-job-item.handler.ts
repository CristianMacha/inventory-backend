import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { RemoveJobItemCommand } from './remove-job-item.command';
import { IJobRepository } from '../../../domain/repositories/job.repository';
import { JobId } from '../../../domain/value-objects/job-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { PROJECTS_TOKENS } from '../../projects.tokens';

@CommandHandler(RemoveJobItemCommand)
export class RemoveJobItemHandler implements ICommandHandler<RemoveJobItemCommand> {
  constructor(
    @Inject(PROJECTS_TOKENS.JOB_REPOSITORY)
    private readonly jobRepository: IJobRepository,
  ) {}

  async execute(command: RemoveJobItemCommand): Promise<void> {
    const { jobId, itemId, userId } = command;

    const job = await this.jobRepository.findById(JobId.create(jobId));
    if (!job) {
      throw new ResourceNotFoundException('Job', jobId);
    }

    job.removeItem(itemId, userId);
    await Promise.all([
      this.jobRepository.save(job),
      this.jobRepository.removeItem(itemId),
    ]);
  }
}
