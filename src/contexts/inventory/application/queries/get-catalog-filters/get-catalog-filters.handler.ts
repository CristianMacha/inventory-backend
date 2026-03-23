import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetCatalogFiltersQuery } from './get-catalog-filters.query';
import { ICategoryRepository } from '@contexts/inventory/domain/repositories/category.repository';
import { IBrandRepository } from '@contexts/inventory/domain/repositories/brand.repository';
import { ILevelRepository } from '@contexts/inventory/domain/repositories/level.repository';
import { IFinishRepository } from '@contexts/inventory/domain/repositories/finish.repository';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';
import type { CatalogFiltersOutputDto } from '@contexts/inventory/application/dtos/catalog-filters-output.dto';

@QueryHandler(GetCatalogFiltersQuery)
export class GetCatalogFiltersHandler implements IQueryHandler<GetCatalogFiltersQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
    @Inject(INVENTORY_TOKENS.BRAND_REPOSITORY)
    private readonly brandRepository: IBrandRepository,
    @Inject(INVENTORY_TOKENS.LEVEL_REPOSITORY)
    private readonly levelRepository: ILevelRepository,
    @Inject(INVENTORY_TOKENS.FINISH_REPOSITORY)
    private readonly finishRepository: IFinishRepository,
  ) {}

  async execute(): Promise<CatalogFiltersOutputDto> {
    const [categories, brands, levels, finishes] = await Promise.all([
      this.categoryRepository.findAllActive(),
      this.brandRepository.findAllActive(),
      this.levelRepository.findAllActive(),
      this.finishRepository.findAllActive(),
    ]);

    return {
      categories: categories.map((c) => ({ id: c.id.getValue(), name: c.name })),
      brands: brands.map((b) => ({ id: b.id.getValue(), name: b.name })),
      levels: levels.map((l) => ({ id: l.id.getValue(), name: l.name })),
      finishes: finishes.map((f) => ({ id: f.id.getValue(), name: f.name })),
    };
  }
}
