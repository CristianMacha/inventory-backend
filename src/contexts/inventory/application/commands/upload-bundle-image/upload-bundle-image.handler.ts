import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UploadBundleImageCommand } from './upload-bundle-image.command';
import { IBundleRepository } from '@contexts/inventory/domain/repositories/bundle.repository';
import { BundleId } from '@contexts/inventory/domain/value-objects/bundle-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';
import { STORAGE_TOKENS } from '@shared/storage/storage.tokens';
import { CloudinaryService } from '@shared/storage/cloudinary/cloudinary.service';

@CommandHandler(UploadBundleImageCommand)
export class UploadBundleImageHandler implements ICommandHandler<UploadBundleImageCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.BUNDLE_REPOSITORY)
    private readonly bundleRepository: IBundleRepository,
    @Inject(STORAGE_TOKENS.CLOUDINARY_SERVICE)
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(
    command: UploadBundleImageCommand,
  ): Promise<{ publicId: string; url: string }> {
    const bundleId = BundleId.create(command.bundleId);
    const bundle = await this.bundleRepository.findById(bundleId);
    if (!bundle) {
      throw new ResourceNotFoundException('Bundle', command.bundleId);
    }

    if (bundle.imagePublicId) {
      await this.cloudinaryService.delete(bundle.imagePublicId);
    }

    const { publicId, url } = await this.cloudinaryService.upload(
      command.file,
      'bundles',
    );

    bundle.updateImagePublicId(publicId, command.userId);
    await this.bundleRepository.save(bundle);

    return { publicId, url };
  }
}
