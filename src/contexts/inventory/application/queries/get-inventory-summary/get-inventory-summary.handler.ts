import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetInventorySummaryQuery } from './get-inventory-summary.query';
import { ISlabRepository } from '@contexts/inventory/domain/repositories/slab.repository';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';
import { InventorySummaryOutputDto } from '@contexts/inventory/application/dtos/inventory-summary-output.dto';

@QueryHandler(GetInventorySummaryQuery)
export class GetInventorySummaryHandler implements IQueryHandler<GetInventorySummaryQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.SLAB_REPOSITORY)
    private readonly slabRepository: ISlabRepository,
  ) {}

  async execute(
    query: GetInventorySummaryQuery,
  ): Promise<InventorySummaryOutputDto> {
    const summaries = await this.slabRepository.getStockSummaryByProduct(
      query.productId,
    );

    const totalAvailableAreaM2 = parseFloat(
      summaries.reduce((acc, s) => acc + s.availableAreaM2, 0).toFixed(2),
    );

    return {
      products: summaries.map((s) => ({
        productId: s.productId,
        productName: s.productName,
        bundleCount: s.bundleCount,
        totalSlabs: s.totalSlabs,
        slabsByStatus: s.slabsByStatus,
        availableAreaM2: s.availableAreaM2,
        totalAreaM2: s.totalAreaM2,
      })),
      totalProducts: summaries.length,
      totalBundles: summaries.reduce((acc, s) => acc + s.bundleCount, 0),
      totalSlabs: summaries.reduce((acc, s) => acc + s.totalSlabs, 0),
      totalAvailableAreaM2,
    };
  }
}
