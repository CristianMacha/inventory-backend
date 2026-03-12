import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteMaterialCommand } from './delete-material.command';
import { IMaterialRepository } from '../../../domain/repositories/imaterial.repository';
import { MaterialId } from '../../../domain/value-objects/material-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@CommandHandler(DeleteMaterialCommand)
export class DeleteMaterialHandler implements ICommandHandler<DeleteMaterialCommand> {
  constructor(
    @Inject(WORKSHOP_TOKENS.MATERIAL_REPOSITORY)
    private readonly materialRepository: IMaterialRepository,
  ) {}

  async execute(command: DeleteMaterialCommand): Promise<void> {
    const materialId = MaterialId.create(command.id);
    const material = await this.materialRepository.findById(materialId);
    if (!material) throw new ResourceNotFoundException('Material', command.id);
    await this.materialRepository.delete(materialId);
  }
}
