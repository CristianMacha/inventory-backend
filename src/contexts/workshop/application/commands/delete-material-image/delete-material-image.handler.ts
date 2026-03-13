import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteMaterialImageCommand } from './delete-material-image.command';
import { IMaterialRepository } from '../../../domain/repositories/imaterial.repository';
import { MaterialId } from '../../../domain/value-objects/material-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';
import { STORAGE_TOKENS } from '@shared/storage/storage.tokens';
import { CloudinaryService } from '@shared/storage/cloudinary/cloudinary.service';

@CommandHandler(DeleteMaterialImageCommand)
export class DeleteMaterialImageHandler implements ICommandHandler<DeleteMaterialImageCommand> {
  constructor(
    @Inject(WORKSHOP_TOKENS.MATERIAL_REPOSITORY)
    private readonly materialRepository: IMaterialRepository,
    @Inject(STORAGE_TOKENS.CLOUDINARY_SERVICE)
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(command: DeleteMaterialImageCommand): Promise<void> {
    const materialId = MaterialId.create(command.materialId);
    const material = await this.materialRepository.findById(materialId);
    if (!material)
      throw new ResourceNotFoundException('Material', command.materialId);

    if (material.imagePublicId) {
      await this.cloudinaryService.delete(material.imagePublicId);
      material.updateImagePublicId(null, command.userId);
      await this.materialRepository.save(material);
    }
  }
}
