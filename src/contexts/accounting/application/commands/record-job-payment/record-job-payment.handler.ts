import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { RecordJobPaymentCommand } from './record-job-payment.command';
import { ACCOUNTING_TOKENS } from '../../accounting.tokens';
import { PROJECTS_TOKENS } from '@contexts/projects/application/projects.tokens';
import { IJobPaymentRepository } from '../../../domain/repositories/job-payment.repository';
import { IJobRepository } from '@contexts/projects/domain/repositories/job.repository';
import { JobId } from '@contexts/projects/domain/value-objects/job-id';
import { JobStatus } from '@contexts/projects/domain/enums/job-status.enum';
import { JobPayment } from '../../../domain/entities/job-payment';
import { JobNotCollectibleException } from '../../../domain/errors/job-not-collectible.exception';
import { PaymentExceedsBalanceException } from '../../../domain/errors/payment-exceeds-balance.exception';
import { JobPaymentRecordedEvent } from '../../../domain/events/job-payment-recorded.event';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { JobPaymentEntity } from '../../../infrastructure/persistence/typeorm/entities/job-payment.entity';
import { JobPaymentMapper } from '../../../infrastructure/persistence/typeorm/mappers/job-payment.mapper';
import { JobEntity } from '@contexts/projects/infrastructure/persistence/typeorm/entities/job.entity';
import { JobMapper } from '@contexts/projects/infrastructure/persistence/typeorm/mappers/job.mapper';

@CommandHandler(RecordJobPaymentCommand)
export class RecordJobPaymentHandler implements ICommandHandler<RecordJobPaymentCommand> {
  constructor(
    @Inject(ACCOUNTING_TOKENS.JOB_PAYMENT_REPOSITORY)
    private readonly jobPaymentRepository: IJobPaymentRepository,
    @Inject(PROJECTS_TOKENS.JOB_REPOSITORY)
    private readonly jobRepository: IJobRepository,
    private readonly dataSource: DataSource,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RecordJobPaymentCommand): Promise<string> {
    const { jobId, amount, paymentMethod, paymentDate, reference, userId } =
      command;

    const job = await this.jobRepository.findById(JobId.create(jobId));
    if (!job) {
      throw new ResourceNotFoundException('Job', jobId);
    }

    const collectibleStatuses: JobStatus[] = [
      JobStatus.APPROVED,
      JobStatus.IN_PROGRESS,
      JobStatus.COMPLETED,
    ];
    if (!collectibleStatuses.includes(job.status)) {
      throw new JobNotCollectibleException(job.status);
    }

    const totalPaid = await this.jobPaymentRepository.sumByJobId(jobId);
    const remaining = job.totalAmount - totalPaid;

    if (amount > remaining) {
      throw new PaymentExceedsBalanceException(remaining);
    }

    const payment = JobPayment.create(
      jobId,
      amount,
      paymentMethod,
      paymentDate,
      reference,
      userId,
    );

    job.applyPayment(amount, userId);

    const { items, ...jobFields } = JobMapper.toPersistence(job);
    const paymentEntity = JobPaymentMapper.toPersistence(payment);

    await this.dataSource.transaction(async (manager) => {
      await manager.save(JobEntity, jobFields as JobEntity);
      await manager.save(JobPaymentEntity, paymentEntity);
    });

    this.eventBus.publish(new JobPaymentRecordedEvent(jobId, amount, userId));

    return payment.id.getValue();
  }
}
