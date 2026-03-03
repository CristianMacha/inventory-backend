import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';

import { SupplierReturnCreditedEvent } from '@contexts/purchasing/domain/events/supplier-return-credited.event';
import { ISlabRepository } from '../../domain/repositories/slab.repository';
import { SlabId } from '../../domain/value-objects/slab-id';
import { SlabStatus } from '../../domain/enums/slab-status.enum';
import { INVENTORY_TOKENS } from '../../inventory.tokens';

@EventsHandler(SupplierReturnCreditedEvent)
export class OnSupplierReturnCreditedHandler implements IEventHandler<SupplierReturnCreditedEvent> {
  private readonly logger = new Logger(OnSupplierReturnCreditedHandler.name);

  constructor(
    @Inject(INVENTORY_TOKENS.SLAB_REPOSITORY)
    private readonly slabRepository: ISlabRepository,
  ) {}

  async handle(event: SupplierReturnCreditedEvent): Promise<void> {
    this.logger.log(
      `SupplierReturn ${event.returnId} credited — marking ${event.slabIds.length} slab(s) as RETURNED`,
    );

    for (const slabIdValue of event.slabIds) {
      const slab = await this.slabRepository.findById(
        SlabId.create(slabIdValue),
      );
      if (slab) {
        slab.updateStatus(SlabStatus.RETURNED, 'system');
        await this.slabRepository.save(slab);
      } else {
        this.logger.warn(
          `Slab ${slabIdValue} not found while processing return ${event.returnId}`,
        );
      }
    }
  }
}
