import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetBrandsQuery } from './get-brands.query';
import { IBrandRepository } from '@contexts/inventory/domain/repositories/brand.repository';
import { IBrandOutputDto } from '@contexts/inventory/application/dtos/brand-output.dto';
import { BrandResponseMapper } from '@contexts/inventory/application/mappers/brand-response.mapper';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@QueryHandler(GetBrandsQuery)
export class GetBrandsHandler implements IQueryHandler<GetBrandsQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.BRAND_REPOSITORY)
    private readonly brandRepository: IBrandRepository,
  ) {}

  async execute(query: GetBrandsQuery): Promise<IBrandOutputDto[]> {
    const brands = await this.brandRepository.findAll();

    return (brands ?? []).map((e) => BrandResponseMapper.toResponse(e));
  }
}
