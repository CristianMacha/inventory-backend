import { ToolMovement } from '../entities/tool-movement.entity';
import { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';
import { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

export interface IToolMovementRepository {
  findByTool(
    toolId: string,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<ToolMovement>>;
  save(movement: ToolMovement): Promise<void>;
}
