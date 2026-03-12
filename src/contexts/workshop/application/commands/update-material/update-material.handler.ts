import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateMaterialCommand } from './update-material.command';
import { IMaterialRepository } from '../../../domain/repositories/imaterial.repository';
import { MaterialId } from '../../../domain/value-objects/material-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@CommandHandler(UpdateMaterialCommand)
export class UpdateMaterialHandler implements ICommandHandler<UpdateMaterialCommand> {
  constructor(
    @Inject(WORKSHOP_TOKENS.MATERIAL_REPOSITORY)
    private readonly materialRepository: IMaterialRepository,
  ) {}

  async execute(command: UpdateMaterialCommand): Promise<void> {
    const { id, updatedBy, name, description, unit, minStock, unitPrice, categoryId, supplierId } = command;

    const material = await this.materialRepository.findById(MaterialId.create(id));
    if (!material) throw new ResourceNotFoundException('Material', id);

    material.update(updatedBy, name, description, unit, minStock, unitPrice, categoryId, supplierId);
    await this.materialRepository.save(material);
  }
}
