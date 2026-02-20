import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetActiveBrandsQuery } from './get-active-brands.query';
import { IBrandRepository } from '../../../domain/repositories/brand.repository';
import { IBrandOutputDto } from '../../dtos/brand-output.dto';
import { BrandResponseMapper } from '../../mappers/brand-response.mapper';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@QueryHandler(GetActiveBrandsQuery)
export class GetActiveBrandsHandler implements IQueryHandler<GetActiveBrandsQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.BRAND_REPOSITORY)
    private readonly brandRepository: IBrandRepository,
  ) {}

  async execute(_query: GetActiveBrandsQuery): Promise<IBrandOutputDto[]> {
    const brands = await this.brandRepository.findAllActive();
    return brands.map((b) => BrandResponseMapper.toResponse(b));
  }
}
