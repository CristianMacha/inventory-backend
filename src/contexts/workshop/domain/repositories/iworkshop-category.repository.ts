import { WorkshopCategory } from '../entities/workshop-category.entity';
import { WorkshopCategoryId } from '../value-objects/workshop-category-id';

export interface IWorkshopCategoryRepository {
  findAll(): Promise<WorkshopCategory[]>;
  findById(id: WorkshopCategoryId): Promise<WorkshopCategory | null>;
  findByName(name: string): Promise<WorkshopCategory | null>;
  save(category: WorkshopCategory): Promise<void>;
}
