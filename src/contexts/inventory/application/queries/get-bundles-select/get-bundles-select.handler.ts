import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetBundlesSelectQuery } from './get-bundles-select.query';
import { IBundleRepository } from '../../../domain/repositories/bundle.repository';
import { IBundleOutputDto } from '../../dtos/bundle-output.dto';
import { BundleResponseMapper } from '../../mappers/bundle-response.mapper';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@QueryHandler(GetBundlesSelectQuery)
export class GetBundlesSelectHandler implements IQueryHandler<GetBundlesSelectQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.BUNDLE_REPOSITORY)
    private readonly bundleRepository: IBundleRepository,
  ) {}

  async execute(query: GetBundlesSelectQuery): Promise<IBundleOutputDto[]> {
    const results = await this.bundleRepository.findForSelect({
      supplierId: query.supplierId,
      unlinked: query.unlinked,
    });

    return results.map(({ bundle, productName, supplierName, invoiceNumber }) =>
      BundleResponseMapper.toResponse(bundle, productName, supplierName, invoiceNumber),
    );
  }
}
