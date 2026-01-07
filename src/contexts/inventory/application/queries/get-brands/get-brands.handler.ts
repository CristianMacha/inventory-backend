import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetBrandsQuery } from './get-brands.query';
import { IBrandRepository } from '@contexts/inventory/domain/repositories/brand.repository';
import { IBrandOutputDto } from '@contexts/inventory/application/dtos/brand-output.dto';
import { BrandResponseMapper } from '@contexts/inventory/application/mappers/brand-response.mapper';

@QueryHandler(GetBrandsQuery)
export class GetBrandsHandler implements IQueryHandler<GetBrandsQuery> {
  constructor(
    @Inject('BrandRepository')
    private readonly brandRepository: IBrandRepository,
  ) {}

  async execute(query: GetBrandsQuery): Promise<IBrandOutputDto[] | null> {
    const brands = await this.brandRepository.findAll();

    return brands ? brands.map((e) => BrandResponseMapper.toResponse(e)) : null;
  }
}
