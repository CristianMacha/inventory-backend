import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetSlabsQuery } from './get-slabs.query';
import { ISlabRepository } from '../../../domain/repositories/slab.repository';
import { ISlabOutputDto } from '../../dtos/slab-output.dto';
import { SlabResponseMapper } from '../../mappers/slab-response.mapper';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';
import {
  buildPaginatedResult,
  type PaginatedResult,
} from '@shared/domain/pagination/paginated-result.interface';

@QueryHandler(GetSlabsQuery)
export class GetSlabsHandler implements IQueryHandler<GetSlabsQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.SLAB_REPOSITORY)
    private readonly slabRepository: ISlabRepository,
  ) {}

  async execute(
    query: GetSlabsQuery,
  ): Promise<PaginatedResult<ISlabOutputDto>> {
    const result = await this.slabRepository.findPaginated(
      query.pagination,
      query.bundleId ? { bundleId: query.bundleId } : undefined,
    );
    return buildPaginatedResult(
      result.data.map((s) => SlabResponseMapper.toResponse(s)),
      result.total,
      result.page,
      result.limit,
    );
  }
}
