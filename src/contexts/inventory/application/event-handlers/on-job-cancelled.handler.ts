import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';

import { JobCancelledEvent } from '@contexts/projects/domain/events/job-cancelled.event';
import { ISlabRepository } from '../../domain/repositories/slab.repository';
import { SlabId } from '../../domain/value-objects/slab-id';
import { SlabStatus } from '../../domain/enums/slab-status.enum';
import { INVENTORY_TOKENS } from '../../inventory.tokens';

@EventsHandler(JobCancelledEvent)
export class OnJobCancelledHandler implements IEventHandler<JobCancelledEvent> {
  private readonly logger = new Logger(OnJobCancelledHandler.name);

  constructor(
    @Inject(INVENTORY_TOKENS.SLAB_REPOSITORY)
    private readonly slabRepository: ISlabRepository,
  ) {}

  async handle(event: JobCancelledEvent): Promise<void> {
    this.logger.log(
      `Job ${event.jobId} cancelled — releasing ${event.slabIds.length} slab(s)`,
    );

    for (const slabIdValue of event.slabIds) {
      const slab = await this.slabRepository.findById(
        SlabId.create(slabIdValue),
      );
      if (slab) {
        slab.updateStatus(SlabStatus.AVAILABLE, 'system');
        await this.slabRepository.save(slab);
      } else {
        this.logger.warn(
          `Slab ${slabIdValue} not found while releasing for job ${event.jobId}`,
        );
      }
    }
  }
}
