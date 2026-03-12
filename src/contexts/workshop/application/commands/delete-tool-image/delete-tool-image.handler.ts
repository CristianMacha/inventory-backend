import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteToolImageCommand } from './delete-tool-image.command';
import { IToolRepository } from '../../../domain/repositories/itool.repository';
import { ToolId } from '../../../domain/value-objects/tool-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';
import { STORAGE_TOKENS } from '@shared/storage/storage.tokens';
import { CloudinaryService } from '@shared/storage/cloudinary/cloudinary.service';

@CommandHandler(DeleteToolImageCommand)
export class DeleteToolImageHandler implements ICommandHandler<DeleteToolImageCommand> {
  constructor(
    @Inject(WORKSHOP_TOKENS.TOOL_REPOSITORY)
    private readonly toolRepository: IToolRepository,
    @Inject(STORAGE_TOKENS.CLOUDINARY_SERVICE)
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(command: DeleteToolImageCommand): Promise<void> {
    const toolId = ToolId.create(command.toolId);
    const tool = await this.toolRepository.findById(toolId);
    if (!tool) throw new ResourceNotFoundException('Tool', command.toolId);

    if (tool.imagePublicId) {
      await this.cloudinaryService.delete(tool.imagePublicId);
      tool.updateImagePublicId(null, command.userId);
      await this.toolRepository.save(tool);
    }
  }
}
