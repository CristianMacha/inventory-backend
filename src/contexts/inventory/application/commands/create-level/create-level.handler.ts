import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Inject } from '@nestjs/common';

import { CreateLevelCommand } from './create-level.command';
import { ILevelRepository } from '../../../domain/repositories/level.repository';
import { Level } from '../../../domain/entities/level';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@CommandHandler(CreateLevelCommand)
export class CreateLevelHandler implements ICommandHandler<CreateLevelCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.LEVEL_REPOSITORY)
    private readonly levelRepository: ILevelRepository,
  ) {}

  async execute(command: CreateLevelCommand): Promise<void> {
    const { name, sortOrder, description } = command;

    const existing = await this.levelRepository.findByName(name);
    if (existing) {
      throw new ConflictException(`Level with name "${name}" already exists`);
    }

    const level = Level.create(name, sortOrder ?? 0, description ?? '');
    await this.levelRepository.save(level);
  }
}
