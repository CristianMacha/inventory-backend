import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { StartJobCommand } from './start-job.command';
import { IJobRepository } from '../../../domain/repositories/job.repository';
import { JobId } from '../../../domain/value-objects/job-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { PROJECTS_TOKENS } from '../../projects.tokens';

@CommandHandler(StartJobCommand)
export class StartJobHandler implements ICommandHandler<StartJobCommand> {
  constructor(
    @Inject(PROJECTS_TOKENS.JOB_REPOSITORY)
    private readonly jobRepository: IJobRepository,
  ) {}

  async execute(command: StartJobCommand): Promise<void> {
    const { jobId, userId } = command;

    const job = await this.jobRepository.findById(JobId.create(jobId));
    if (!job) {
      throw new ResourceNotFoundException('Job', jobId);
    }

    job.start(userId);
    await this.jobRepository.save(job);
  }
}
