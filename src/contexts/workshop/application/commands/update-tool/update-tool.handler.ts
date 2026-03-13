import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateToolCommand } from './update-tool.command';
import { IToolRepository } from '../../../domain/repositories/itool.repository';
import { ToolId } from '../../../domain/value-objects/tool-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@CommandHandler(UpdateToolCommand)
export class UpdateToolHandler implements ICommandHandler<UpdateToolCommand> {
  constructor(
    @Inject(WORKSHOP_TOKENS.TOOL_REPOSITORY)
    private readonly toolRepository: IToolRepository,
  ) {}

  async execute(command: UpdateToolCommand): Promise<void> {
    const {
      id,
      updatedBy,
      name,
      description,
      status,
      categoryId,
      supplierId,
      purchasePrice,
    } = command;

    const tool = await this.toolRepository.findById(ToolId.create(id));
    if (!tool) throw new ResourceNotFoundException('Tool', id);

    tool.update(
      updatedBy,
      name,
      description,
      status,
      categoryId,
      supplierId,
      purchasePrice,
    );
    await this.toolRepository.save(tool);
  }
}
