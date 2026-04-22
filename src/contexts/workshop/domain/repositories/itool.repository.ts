import { Tool } from '../entities/tool.entity';
import { ToolId } from '../value-objects/tool-id';
import { ToolStatus } from '../enums/tool-status.enum';
import { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';
import { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

export interface IToolRepository {
  findAll(pagination: PaginationParams): Promise<PaginatedResult<Tool>>;
  findById(id: ToolId): Promise<Tool | null>;
  findByName(name: string): Promise<Tool | null>;
  findByStatus(status: ToolStatus): Promise<Tool[]>;
  save(tool: Tool): Promise<void>;
  delete(id: ToolId): Promise<void>;
}
