import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { UpdateJobCommand } from './update-job.command';
import { IJobRepository } from '../../../domain/repositories/job.repository';
import { JobId } from '../../../domain/value-objects/job-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { PROJECTS_TOKENS } from '../../projects.tokens';

@CommandHandler(UpdateJobCommand)
export class UpdateJobHandler implements ICommandHandler<UpdateJobCommand> {
  constructor(
    @Inject(PROJECTS_TOKENS.JOB_REPOSITORY)
    private readonly jobRepository: IJobRepository,
  ) {}

  async execute(command: UpdateJobCommand): Promise<void> {
    const {
      jobId,
      userId,
      projectName,
      clientName,
      clientPhone,
      clientEmail,
      clientAddress,
      notes,
      scheduledDate,
      taxAmount,
    } = command;

    const job = await this.jobRepository.findById(JobId.create(jobId));
    if (!job) {
      throw new ResourceNotFoundException('Job', jobId);
    }

    if (projectName !== undefined) {
      job.updateProjectName(projectName, userId);
    }

    if (
      clientName !== undefined ||
      clientPhone !== undefined ||
      clientEmail !== undefined ||
      clientAddress !== undefined
    ) {
      job.updateClientInfo(
        clientName ?? job.clientName,
        clientPhone ?? job.clientPhone,
        clientEmail ?? job.clientEmail,
        clientAddress ?? job.clientAddress,
        userId,
      );
    }

    if (notes !== undefined) {
      job.updateNotes(notes, userId);
    }

    if (scheduledDate !== undefined) {
      job.updateScheduledDate(scheduledDate, userId);
    }

    if (taxAmount !== undefined) {
      job.updateTaxAmount(taxAmount, userId);
    }

    await this.jobRepository.save(job);
  }
}
