import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteToolCommand } from './delete-tool.command';
import { IToolRepository } from '../../../domain/repositories/itool.repository';
import { ToolId } from '../../../domain/value-objects/tool-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@CommandHandler(DeleteToolCommand)
export class DeleteToolHandler implements ICommandHandler<DeleteToolCommand> {
  constructor(
    @Inject(WORKSHOP_TOKENS.TOOL_REPOSITORY)
    private readonly toolRepository: IToolRepository,
  ) {}

  async execute(command: DeleteToolCommand): Promise<void> {
    const toolId = ToolId.create(command.id);
    const tool = await this.toolRepository.findById(toolId);
    if (!tool) throw new ResourceNotFoundException('Tool', command.id);
    await this.toolRepository.delete(toolId);
  }
}
