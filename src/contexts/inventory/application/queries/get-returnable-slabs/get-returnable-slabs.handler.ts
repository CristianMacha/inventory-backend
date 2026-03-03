import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetReturnableSlabsQuery } from './get-returnable-slabs.query';
import { ISlabRepository } from '@contexts/inventory/domain/repositories/slab.repository';
import { SlabReturnableOutputDto } from '../../dtos/slab-returnable-output.dto';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@QueryHandler(GetReturnableSlabsQuery)
export class GetReturnableSlabsHandler implements IQueryHandler<GetReturnableSlabsQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.SLAB_REPOSITORY)
    private readonly slabRepository: ISlabRepository,
  ) {}

  async execute(
    query: GetReturnableSlabsQuery,
  ): Promise<SlabReturnableOutputDto[]> {
    const results = await this.slabRepository.findReturnable({
      purchaseInvoiceId: query.purchaseInvoiceId,
      bundleId: query.bundleId,
    });

    return results.map(({ slab, lotNumber }) => ({
      id: slab.id.getValue(),
      bundleId: slab.bundleId.getValue(),
      lotNumber,
      code: slab.code,
      widthCm: slab.dimensions.width,
      heightCm: slab.dimensions.height,
      dimensions: slab.dimensions.toString(),
      status: slab.status,
      description: slab.description,
    }));
  }
}
