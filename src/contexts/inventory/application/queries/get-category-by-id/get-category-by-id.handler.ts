import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetCategoryByIdQuery } from './get-category-by-id.query';
import { ICategoryRepository } from '@contexts/inventory/domain/repositories/category.repository';
import { ICategoryOutputDto } from '@contexts/inventory/application/dtos/category-output.dto';
import { CategoryResponseMapper } from '@contexts/inventory/application/mappers/category-response.mapper';
import { CategoryId } from '@contexts/inventory/domain/value-objects/category-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@QueryHandler(GetCategoryByIdQuery)
export class GetCategoryByIdHandler implements IQueryHandler<GetCategoryByIdQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(query: GetCategoryByIdQuery): Promise<ICategoryOutputDto> {
    const category = await this.categoryRepository.findById(
      CategoryId.create(query.id),
    );
    if (!category) {
      throw new ResourceNotFoundException('Category', query.id);
    }
    return CategoryResponseMapper.toResponse(category);
  }
}
