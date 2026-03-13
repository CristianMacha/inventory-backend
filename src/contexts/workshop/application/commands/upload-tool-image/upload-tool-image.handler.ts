import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UploadToolImageCommand } from './upload-tool-image.command';
import { IToolRepository } from '../../../domain/repositories/itool.repository';
import { ToolId } from '../../../domain/value-objects/tool-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';
import { STORAGE_TOKENS } from '@shared/storage/storage.tokens';
import { CloudinaryService } from '@shared/storage/cloudinary/cloudinary.service';

@CommandHandler(UploadToolImageCommand)
export class UploadToolImageHandler implements ICommandHandler<UploadToolImageCommand> {
  constructor(
    @Inject(WORKSHOP_TOKENS.TOOL_REPOSITORY)
    private readonly toolRepository: IToolRepository,
    @Inject(STORAGE_TOKENS.CLOUDINARY_SERVICE)
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(
    command: UploadToolImageCommand,
  ): Promise<{ publicId: string; url: string }> {
    const toolId = ToolId.create(command.toolId);
    const tool = await this.toolRepository.findById(toolId);
    if (!tool) throw new ResourceNotFoundException('Tool', command.toolId);

    if (tool.imagePublicId) {
      await this.cloudinaryService.delete(tool.imagePublicId);
    }

    const { publicId, url } = await this.cloudinaryService.upload(
      command.file,
      'workshop/tools',
    );
    tool.updateImagePublicId(publicId, command.userId);
    await this.toolRepository.save(tool);

    return { publicId, url };
  }
}
