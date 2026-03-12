import { WorkshopCategory } from '../../domain/entities/workshop-category.entity';
import { WorkshopCategoryDto } from '../dtos/workshop-category.dto';

export class WorkshopCategoryMapper {
  static toDto(category: WorkshopCategory): WorkshopCategoryDto {
    return {
      id: category.id.getValue(),
      name: category.name,
      description: category.description,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }
}
