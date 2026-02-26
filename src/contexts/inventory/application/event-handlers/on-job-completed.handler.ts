import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';

import { JobCompletedEvent } from '@contexts/projects/domain/events/job-completed.event';
import { ISlabRepository } from '../../domain/repositories/slab.repository';
import { SlabId } from '../../domain/value-objects/slab-id';
import { SlabStatus } from '../../domain/enums/slab-status.enum';
import { INVENTORY_TOKENS } from '../../inventory.tokens';

@EventsHandler(JobCompletedEvent)
export class OnJobCompletedHandler implements IEventHandler<JobCompletedEvent> {
  private readonly logger = new Logger(OnJobCompletedHandler.name);

  constructor(
    @Inject(INVENTORY_TOKENS.SLAB_REPOSITORY)
    private readonly slabRepository: ISlabRepository,
  ) {}

  async handle(event: JobCompletedEvent): Promise<void> {
    this.logger.log(
      `Job ${event.jobId} completed — marking ${event.slabIds.length} slab(s) as sold`,
    );

    for (const slabIdValue of event.slabIds) {
      const slab = await this.slabRepository.findById(
        SlabId.create(slabIdValue),
      );
      if (slab) {
        slab.updateStatus(SlabStatus.SOLD, 'system');
        await this.slabRepository.save(slab);
      } else {
        this.logger.warn(
          `Slab ${slabIdValue} not found while completing for job ${event.jobId}`,
        );
      }
    }
  }
}
