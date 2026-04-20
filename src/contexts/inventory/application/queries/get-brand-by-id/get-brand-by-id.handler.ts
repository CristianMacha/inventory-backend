import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetBrandByIdQuery } from './get-brand-by-id.query';
import { IBrandRepository } from '@contexts/inventory/domain/repositories/brand.repository';
import { IBrandOutputDto } from '@contexts/inventory/application/dtos/brand-output.dto';
import { BrandResponseMapper } from '@contexts/inventory/application/mappers/brand-response.mapper';
import { BrandId } from '@contexts/inventory/domain/value-objects/brand-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@QueryHandler(GetBrandByIdQuery)
export class GetBrandByIdHandler implements IQueryHandler<GetBrandByIdQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.BRAND_REPOSITORY)
    private readonly brandRepository: IBrandRepository,
  ) {}

  async execute(query: GetBrandByIdQuery): Promise<IBrandOutputDto> {
    const brand = await this.brandRepository.findById(BrandId.create(query.id));
    if (!brand) {
      throw new ResourceNotFoundException('Brand', query.id);
    }
    return BrandResponseMapper.toResponse(brand);
  }
}
