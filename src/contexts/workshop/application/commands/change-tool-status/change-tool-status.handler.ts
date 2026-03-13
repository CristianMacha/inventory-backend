import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ChangeToolStatusCommand } from './change-tool-status.command';
import { IToolRepository } from '../../../domain/repositories/itool.repository';
import { IToolMovementRepository } from '../../../domain/repositories/itool-movement.repository';
import { ToolMovement } from '../../../domain/entities/tool-movement.entity';
import { ToolId } from '../../../domain/value-objects/tool-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@CommandHandler(ChangeToolStatusCommand)
export class ChangeToolStatusHandler implements ICommandHandler<ChangeToolStatusCommand> {
  constructor(
    @Inject(WORKSHOP_TOKENS.TOOL_REPOSITORY)
    private readonly toolRepository: IToolRepository,
    @Inject(WORKSHOP_TOKENS.TOOL_MOVEMENT_REPOSITORY)
    private readonly movementRepository: IToolMovementRepository,
  ) {}

  async execute(command: ChangeToolStatusCommand): Promise<void> {
    const { toolId, newStatus, updatedBy, jobId, notes } = command;

    const tool = await this.toolRepository.findById(ToolId.create(toolId));
    if (!tool) throw new ResourceNotFoundException('Tool', toolId);

    const previousStatus = tool.status;
    tool.update(updatedBy, undefined, undefined, newStatus);
    await this.toolRepository.save(tool);

    const movement = ToolMovement.create(
      toolId,
      previousStatus,
      newStatus,
      updatedBy,
      jobId,
      notes,
    );
    await this.movementRepository.save(movement);
  }
}
