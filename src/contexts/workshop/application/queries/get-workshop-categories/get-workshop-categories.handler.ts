import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetWorkshopCategoriesQuery } from './get-workshop-categories.query';
import { IWorkshopCategoryRepository } from '../../../domain/repositories/iworkshop-category.repository';
import { WorkshopCategoryDto } from '../../dtos/workshop-category.dto';
import { WorkshopCategoryMapper } from '../../mappers/workshop-category.mapper';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@QueryHandler(GetWorkshopCategoriesQuery)
export class GetWorkshopCategoriesHandler implements IQueryHandler<GetWorkshopCategoriesQuery> {
  constructor(
    @Inject(WORKSHOP_TOKENS.CATEGORY_REPOSITORY)
    private readonly categoryRepository: IWorkshopCategoryRepository,
  ) {}

  async execute(): Promise<WorkshopCategoryDto[]> {
    const categories = await this.categoryRepository.findAll();
    return categories.map((e) => WorkshopCategoryMapper.toDto(e));
  }
}
