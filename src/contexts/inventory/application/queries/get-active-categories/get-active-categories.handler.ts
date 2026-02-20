import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetActiveCategoriesQuery } from './get-active-categories.query';
import { ICategoryRepository } from '../../../domain/repositories/category.repository';
import { ICategoryOutputDto } from '../../dtos/category-output.dto';
import { CategoryResponseMapper } from '../../mappers/category-response.mapper';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@QueryHandler(GetActiveCategoriesQuery)
export class GetActiveCategoriesHandler implements IQueryHandler<GetActiveCategoriesQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(
    _query: GetActiveCategoriesQuery,
  ): Promise<ICategoryOutputDto[]> {
    const categories = await this.categoryRepository.findAllActive();
    return categories.map((c) => CategoryResponseMapper.toResponse(c));
  }
}
