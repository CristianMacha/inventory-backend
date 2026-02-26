import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { AddJobItemCommand } from './add-job-item.command';
import { IJobRepository } from '../../../domain/repositories/job.repository';
import { JobId } from '../../../domain/value-objects/job-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { PROJECTS_TOKENS } from '../../projects.tokens';

@CommandHandler(AddJobItemCommand)
export class AddJobItemHandler implements ICommandHandler<AddJobItemCommand> {
  constructor(
    @Inject(PROJECTS_TOKENS.JOB_REPOSITORY)
    private readonly jobRepository: IJobRepository,
  ) {}

  async execute(command: AddJobItemCommand): Promise<void> {
    const { jobId, slabId, description, unitPrice, userId } = command;

    const job = await this.jobRepository.findById(JobId.create(jobId));
    if (!job) {
      throw new ResourceNotFoundException('Job', jobId);
    }

    job.addItem(slabId, description, unitPrice, userId);
    await this.jobRepository.save(job);
  }
}
