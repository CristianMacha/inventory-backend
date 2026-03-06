import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteProductImageCommand } from './delete-product-image.command';
import { IProductImageRepository } from '@contexts/inventory/domain/repositories/product-image.repository';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';
import { STORAGE_TOKENS } from '@shared/storage/storage.tokens';
import { CloudinaryService } from '@shared/storage/cloudinary/cloudinary.service';

@CommandHandler(DeleteProductImageCommand)
export class DeleteProductImageHandler implements ICommandHandler<DeleteProductImageCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.PRODUCT_IMAGE_REPOSITORY)
    private readonly productImageRepository: IProductImageRepository,
    @Inject(STORAGE_TOKENS.CLOUDINARY_SERVICE)
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(command: DeleteProductImageCommand): Promise<void> {
    const image = await this.productImageRepository.findById(command.imageId);
    if (!image) {
      throw new ResourceNotFoundException('ProductImage', command.imageId);
    }

    await this.cloudinaryService.delete(image.publicId);
    await this.productImageRepository.delete(command.imageId);
  }
}
