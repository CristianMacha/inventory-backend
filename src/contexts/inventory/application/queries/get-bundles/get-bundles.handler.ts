import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetBundlesQuery } from './get-bundles.query';
import { IBundleRepository } from '../../../domain/repositories/bundle.repository';
import { IBundleOutputDto } from '../../dtos/bundle-output.dto';
import { BundleResponseMapper } from '../../mappers/bundle-response.mapper';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';
import {
  buildPaginatedResult,
  type PaginatedResult,
} from '@shared/domain/pagination/paginated-result.interface';

@QueryHandler(GetBundlesQuery)
export class GetBundlesHandler implements IQueryHandler<GetBundlesQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.BUNDLE_REPOSITORY)
    private readonly bundleRepository: IBundleRepository,
  ) {}

  async execute(
    query: GetBundlesQuery,
  ): Promise<PaginatedResult<IBundleOutputDto>> {
    const filters =
      query.productId || query.supplierId || query.search
        ? {
            productId: query.productId,
            supplierId: query.supplierId,
            search: query.search,
          }
        : undefined;

    const result = await this.bundleRepository.findPaginatedWithRelations(
      query.pagination,
      filters,
    );
    return buildPaginatedResult(
      result.data.map(({ bundle, productName, supplierName, invoiceNumber }) =>
        BundleResponseMapper.toResponse(
          bundle,
          productName,
          supplierName,
          invoiceNumber,
        ),
      ),
      result.total,
      result.page,
      result.limit,
    );
  }
}
