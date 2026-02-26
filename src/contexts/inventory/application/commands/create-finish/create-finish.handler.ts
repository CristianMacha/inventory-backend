import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Inject } from '@nestjs/common';

import { CreateFinishCommand } from './create-finish.command';
import { IFinishRepository } from '../../../domain/repositories/finish.repository';
import { Finish } from '../../../domain/entities/finish';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@CommandHandler(CreateFinishCommand)
export class CreateFinishHandler implements ICommandHandler<CreateFinishCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.FINISH_REPOSITORY)
    private readonly finishRepository: IFinishRepository,
  ) {}

  async execute(command: CreateFinishCommand): Promise<void> {
    const { name, abbreviation, description } = command;

    const existing = await this.finishRepository.findByName(name);
    if (existing) {
      throw new ConflictException(`Finish with name "${name}" already exists`);
    }

    const finish = Finish.create(name, abbreviation ?? '', description ?? '');
    await this.finishRepository.save(finish);
  }
}
