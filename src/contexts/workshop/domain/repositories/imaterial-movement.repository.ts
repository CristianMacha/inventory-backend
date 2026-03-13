import { MaterialMovement } from '../entities/material-movement.entity';
import { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';
import { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

export interface IMaterialMovementRepository {
  findByMaterial(
    materialId: string,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<MaterialMovement>>;
  getStockForMaterial(materialId: string): Promise<number>;
  save(movement: MaterialMovement): Promise<void>;
}
