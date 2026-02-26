import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';

import { JobApprovedEvent } from '@contexts/projects/domain/events/job-approved.event';
import { ISlabRepository } from '../../domain/repositories/slab.repository';
import { SlabId } from '../../domain/value-objects/slab-id';
import { SlabStatus } from '../../domain/enums/slab-status.enum';
import { INVENTORY_TOKENS } from '../../inventory.tokens';

@EventsHandler(JobApprovedEvent)
export class OnJobApprovedHandler implements IEventHandler<JobApprovedEvent> {
  private readonly logger = new Logger(OnJobApprovedHandler.name);

  constructor(
    @Inject(INVENTORY_TOKENS.SLAB_REPOSITORY)
    private readonly slabRepository: ISlabRepository,
  ) {}

  async handle(event: JobApprovedEvent): Promise<void> {
    this.logger.log(
      `Job ${event.jobId} approved — reserving ${event.slabIds.length} slab(s)`,
    );

    for (const slabIdValue of event.slabIds) {
      const slab = await this.slabRepository.findById(
        SlabId.create(slabIdValue),
      );
      if (slab) {
        slab.updateStatus(SlabStatus.RESERVED, 'system');
        await this.slabRepository.save(slab);
      } else {
        this.logger.warn(
          `Slab ${slabIdValue} not found while reserving for job ${event.jobId}`,
        );
      }
    }
  }
}
