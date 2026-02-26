import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetBundleDetailQuery } from './get-bundle-detail.query';
import { IBundleRepository } from '@contexts/inventory/domain/repositories/bundle.repository';
import { BundleId } from '@contexts/inventory/domain/value-objects/bundle-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';
import { BundleDetailOutputDto } from '@contexts/inventory/application/dtos/bundle-detail-output.dto';
import { SlabResponseMapper } from '@contexts/inventory/application/mappers/slab-response.mapper';

@QueryHandler(GetBundleDetailQuery)
export class GetBundleDetailHandler implements IQueryHandler<GetBundleDetailQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.BUNDLE_REPOSITORY)
    private readonly bundleRepository: IBundleRepository,
  ) {}

  async execute(query: GetBundleDetailQuery): Promise<BundleDetailOutputDto> {
    const bundleId = BundleId.create(query.bundleId);
    const result = await this.bundleRepository.findByIdWithSlabs(bundleId);

    if (!result) {
      throw new ResourceNotFoundException('Bundle', query.bundleId);
    }

    const { bundle, slabs, supplierName, invoiceNumber } = result;

    return {
      id: bundle.id.getValue(),
      supplierId: bundle.supplierId.getValue(),
      supplierName,
      lotNumber: bundle.lotNumber,
      thicknessCm: bundle.thicknessCm,
      purchaseInvoiceId: bundle.purchaseInvoiceId,
      invoiceNumber,
      slabs: slabs.map((slab) => SlabResponseMapper.toResponse(slab)),
      createdBy: bundle.createdBy,
      updatedBy: bundle.updatedBy,
      createdAt: bundle.createdAt.toISOString(),
      updatedAt: bundle.updatedAt.toISOString(),
    };
  }
}
