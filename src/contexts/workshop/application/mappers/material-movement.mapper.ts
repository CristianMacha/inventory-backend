import { MaterialMovement } from '../../domain/entities/material-movement.entity';
import { MaterialMovementDto } from '../dtos/material-movement.dto';

export class MaterialMovementMapper {
  static toDto(movement: MaterialMovement): MaterialMovementDto {
    return {
      id: movement.id.getValue(),
      materialId: movement.materialId,
      delta: movement.delta,
      reason: movement.reason,
      jobId: movement.jobId,
      notes: movement.notes,
      createdBy: movement.createdBy,
      createdAt: movement.createdAt.toISOString(),
    };
  }
}
