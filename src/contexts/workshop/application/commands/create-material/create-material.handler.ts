import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Inject } from '@nestjs/common';
import { CreateMaterialCommand } from './create-material.command';
import { IMaterialRepository } from '../../../domain/repositories/imaterial.repository';
import { Material } from '../../../domain/entities/material.entity';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@CommandHandler(CreateMaterialCommand)
export class CreateMaterialHandler implements ICommandHandler<CreateMaterialCommand> {
  constructor(
    @Inject(WORKSHOP_TOKENS.MATERIAL_REPOSITORY)
    private readonly materialRepository: IMaterialRepository,
  ) {}

  async execute(command: CreateMaterialCommand): Promise<void> {
    const {
      name,
      unit,
      createdBy,
      description,
      minStock,
      unitPrice,
      categoryId,
      supplierId,
    } = command;

    const existing = await this.materialRepository.findByName(name);
    if (existing) {
      throw new ConflictException(
        `Material with name "${name}" already exists`,
      );
    }

    const material = Material.create(
      name,
      unit,
      createdBy,
      description,
      minStock,
      unitPrice,
      categoryId,
      supplierId,
    );
    await this.materialRepository.save(material);
  }
}
