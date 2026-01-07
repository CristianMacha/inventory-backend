import { Category } from '@contexts/inventory/domain/entities/category';
import { ICategoryOutputDto } from '@contexts/inventory/application/dtos/category-output.dto';

export class CategoryResponseMapper {
  public static toResponse(category: Category): ICategoryOutputDto {
    return {
      id: category.id.getValue(),
      name: category.name,
      description: category.description,
      createdBy: category.createdBy,
      updatedBy: category.updatedBy,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }
}
