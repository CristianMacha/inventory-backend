import { Material } from '../entities/material.entity';
import { MaterialId } from '../value-objects/material-id';
import { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';
import { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

export interface IMaterialRepository {
  findAll(pagination: PaginationParams): Promise<PaginatedResult<Material>>;
  findById(id: MaterialId): Promise<Material | null>;
  findByName(name: string): Promise<Material | null>;
  save(material: Material): Promise<void>;
  delete(id: MaterialId): Promise<void>;
}
