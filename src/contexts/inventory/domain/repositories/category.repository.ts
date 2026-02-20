import { CategoryId } from '@contexts/inventory/domain/value-objects/category-id';
import { Category } from '@contexts/inventory/domain/entities/category';

export interface ICategoryRepository {
  findAll(): Promise<Category[] | null>;
  findAllActive(): Promise<Category[]>;
  findById(id: CategoryId): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  save(category: Category): Promise<void>;
  count(): Promise<number>;
}
