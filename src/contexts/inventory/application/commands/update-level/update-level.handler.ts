import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Inject } from '@nestjs/common';

import { UpdateLevelCommand } from './update-level.command';
import { ILevelRepository } from '../../../domain/repositories/level.repository';
import { LevelId } from '../../../domain/value-objects/level-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@CommandHandler(UpdateLevelCommand)
export class UpdateLevelHandler implements ICommandHandler<UpdateLevelCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.LEVEL_REPOSITORY)
    private readonly levelRepository: ILevelRepository,
  ) {}

  async execute(command: UpdateLevelCommand): Promise<void> {
    const { id, name, sortOrder, description, isActive } = command;

    const level = await this.levelRepository.findById(LevelId.create(id));
    if (!level) {
      throw new ResourceNotFoundException('Level', id);
    }

    if (name !== undefined) {
      const existing = await this.levelRepository.findByName(name);
      if (existing && existing.id.getValue() !== id) {
        throw new ConflictException(`Level with name "${name}" already exists`);
      }
      level.updateName(name);
    }

    if (sortOrder !== undefined) {
      level.updateSortOrder(sortOrder);
    }

    if (description !== undefined) {
      level.updateDescription(description);
    }

    if (isActive !== undefined) {
      level.setActive(isActive);
    }

    await this.levelRepository.save(level);
  }
}
