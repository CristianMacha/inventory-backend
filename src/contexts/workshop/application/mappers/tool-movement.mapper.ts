import { ToolMovement } from '../../domain/entities/tool-movement.entity';
import { ToolMovementDto } from '../dtos/tool-movement.dto';

export class ToolMovementMapper {
  static toDto(movement: ToolMovement): ToolMovementDto {
    return {
      id: movement.id.getValue(),
      toolId: movement.toolId,
      previousStatus: movement.previousStatus,
      newStatus: movement.newStatus,
      jobId: movement.jobId,
      notes: movement.notes,
      createdBy: movement.createdBy,
      createdAt: movement.createdAt.toISOString(),
    };
  }
}
