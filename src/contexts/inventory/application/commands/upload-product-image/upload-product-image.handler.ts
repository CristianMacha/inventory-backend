import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UploadProductImageCommand } from './upload-product-image.command';
import { IProductRepository } from '@contexts/inventory/domain/repositories/product.repository';
import { IProductImageRepository } from '@contexts/inventory/domain/repositories/product-image.repository';
import { ProductImage } from '@contexts/inventory/domain/entities/product-image';
import { ProductId } from '@contexts/inventory/domain/value-objects/product-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { DomainException } from '@shared/domain/domain.exception';
import { HttpStatus } from '@nestjs/common';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';
import { STORAGE_TOKENS } from '@shared/storage/storage.tokens';
import { CloudinaryService } from '@shared/storage/cloudinary/cloudinary.service';
import { ProductImageOutputDto } from '../../dtos/product-image-output.dto';

const MAX_PRODUCT_IMAGES = 5;

@CommandHandler(UploadProductImageCommand)
export class UploadProductImageHandler implements ICommandHandler<UploadProductImageCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(INVENTORY_TOKENS.PRODUCT_IMAGE_REPOSITORY)
    private readonly productImageRepository: IProductImageRepository,
    @Inject(STORAGE_TOKENS.CLOUDINARY_SERVICE)
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(
    command: UploadProductImageCommand,
  ): Promise<ProductImageOutputDto & { url: string }> {
    const productId = ProductId.create(command.productId);
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new ResourceNotFoundException('Product', command.productId);
    }

    const count = await this.productImageRepository.countByProductId(
      command.productId,
    );
    if (count >= MAX_PRODUCT_IMAGES) {
      throw new DomainException(
        `Cannot upload more than ${MAX_PRODUCT_IMAGES} images per product`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const { publicId, url } = await this.cloudinaryService.upload(
      command.file,
      'products',
    );

    const image = new ProductImage(
      uuidv4(),
      command.productId,
      publicId,
      count === 0,
      count,
    );
    await this.productImageRepository.save(image);

    return {
      id: image.id,
      publicId,
      isPrimary: image.isPrimary,
      sortOrder: image.sortOrder,
      url,
    };
  }
}
