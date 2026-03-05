import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { CreateJobCommand } from './create-job.command';
import { IJobRepository } from '../../../domain/repositories/job.repository';
import { Job } from '../../../domain/entities/job';
import { PROJECTS_TOKENS } from '../../projects.tokens';

@CommandHandler(CreateJobCommand)
export class CreateJobHandler implements ICommandHandler<CreateJobCommand> {
  constructor(
    @Inject(PROJECTS_TOKENS.JOB_REPOSITORY)
    private readonly jobRepository: IJobRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateJobCommand): Promise<string> {
    const job = Job.create(
      command.projectName,
      command.clientName,
      command.clientPhone ?? '',
      command.clientEmail ?? '',
      command.clientAddress ?? '',
      command.notes ?? '',
      command.createdBy,
      command.scheduledDate,
    );

    await this.jobRepository.save(job);
    this.eventBus.publishAll(job.getUncommittedEvents());
    job.commit();
    return job.id.getValue();
  }
}
