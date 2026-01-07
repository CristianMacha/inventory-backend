import { Category } from '@contexts/inventory/domain/entities/category';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryId } from '@contexts/inventory/domain/value-objects/category-id';

export class CategoryMapper {
  static toDomain(entity: CategoryEntity): Category {
    const categoryId = CategoryId.create(entity.id);
    const category = Category.reconstitute(
      categoryId,
      entity.name,
      entity.description,
      entity.createdBy,
      entity.updatedBy,
      entity.createdAt,
      entity.updatedAt,
    );
    return category;
  }

  static toPersistence(domain: Category): CategoryEntity {
    const entity = new CategoryEntity();
    entity.id = domain.id.getValue();
    entity.name = domain.name;
    entity.description = domain.description;
    entity.createdBy = domain.createdBy;
    entity.updatedBy = domain.updatedBy;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
