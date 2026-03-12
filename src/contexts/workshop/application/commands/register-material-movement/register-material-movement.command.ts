import { MaterialMovementReason } from '../../../domain/enums/material-movement-reason.enum';

export class RegisterMaterialMovementCommand {
  constructor(
    public readonly materialId: string,
    public readonly delta: number,
    public readonly reason: MaterialMovementReason,
    public readonly createdBy: string,
    public readonly jobId?: string,
    public readonly notes?: string,
  ) {}
}
