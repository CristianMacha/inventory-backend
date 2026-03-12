import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UploadMaterialImageCommand } from './upload-material-image.command';
import { IMaterialRepository } from '../../../domain/repositories/imaterial.repository';
import { MaterialId } from '../../../domain/value-objects/material-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';
import { STORAGE_TOKENS } from '@shared/storage/storage.tokens';
import { CloudinaryService } from '@shared/storage/cloudinary/cloudinary.service';

@CommandHandler(UploadMaterialImageCommand)
export class UploadMaterialImageHandler implements ICommandHandler<UploadMaterialImageCommand> {
  constructor(
    @Inject(WORKSHOP_TOKENS.MATERIAL_REPOSITORY)
    private readonly materialRepository: IMaterialRepository,
    @Inject(STORAGE_TOKENS.CLOUDINARY_SERVICE)
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(command: UploadMaterialImageCommand): Promise<{ publicId: string; url: string }> {
    const materialId = MaterialId.create(command.materialId);
    const material = await this.materialRepository.findById(materialId);
    if (!material) throw new ResourceNotFoundException('Material', command.materialId);

    if (material.imagePublicId) {
      await this.cloudinaryService.delete(material.imagePublicId);
    }

    const { publicId, url } = await this.cloudinaryService.upload(command.file, 'workshop/materials');
    material.updateImagePublicId(publicId, command.userId);
    await this.materialRepository.save(material);

    return { publicId, url };
  }
}
