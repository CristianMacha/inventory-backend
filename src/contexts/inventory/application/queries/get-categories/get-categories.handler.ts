import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetCategoriesQuery } from './get-categories.query';
import { ICategoryRepository } from '@contexts/inventory/domain/repositories/category.repository';
import { ICategoryOutputDto } from '@contexts/inventory/application/dtos/category-output.dto';
import { CategoryResponseMapper } from '@contexts/inventory/application/mappers/category-response.mapper';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@QueryHandler(GetCategoriesQuery)
export class GetCategoriesHandler implements IQueryHandler<GetCategoriesQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(): Promise<ICategoryOutputDto[]> {
    const categories = await this.categoryRepository.findAll();

    return (categories ?? []).map((category) =>
      CategoryResponseMapper.toResponse(category),
    );
  }
}
