import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { RegisterMaterialMovementCommand } from './register-material-movement.command';
import { IMaterialRepository } from '../../../domain/repositories/imaterial.repository';
import { IMaterialMovementRepository } from '../../../domain/repositories/imaterial-movement.repository';
import { MaterialMovement } from '../../../domain/entities/material-movement.entity';
import { MaterialId } from '../../../domain/value-objects/material-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@CommandHandler(RegisterMaterialMovementCommand)
export class RegisterMaterialMovementHandler implements ICommandHandler<RegisterMaterialMovementCommand> {
  constructor(
    @Inject(WORKSHOP_TOKENS.MATERIAL_REPOSITORY)
    private readonly materialRepository: IMaterialRepository,
    @Inject(WORKSHOP_TOKENS.MATERIAL_MOVEMENT_REPOSITORY)
    private readonly movementRepository: IMaterialMovementRepository,
  ) {}

  async execute(command: RegisterMaterialMovementCommand): Promise<void> {
    const { materialId, delta, reason, createdBy, jobId, notes } = command;

    const material = await this.materialRepository.findById(
      MaterialId.create(materialId),
    );
    if (!material) throw new ResourceNotFoundException('Material', materialId);

    const movement = MaterialMovement.create(
      materialId,
      delta,
      reason,
      createdBy,
      jobId,
      notes,
    );
    await this.movementRepository.save(movement);
  }
}
