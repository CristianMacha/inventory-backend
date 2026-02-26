import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Inject } from '@nestjs/common';

import { UpdateFinishCommand } from './update-finish.command';
import { IFinishRepository } from '../../../domain/repositories/finish.repository';
import { FinishId } from '../../../domain/value-objects/finish-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@CommandHandler(UpdateFinishCommand)
export class UpdateFinishHandler implements ICommandHandler<UpdateFinishCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.FINISH_REPOSITORY)
    private readonly finishRepository: IFinishRepository,
  ) {}

  async execute(command: UpdateFinishCommand): Promise<void> {
    const { id, name, abbreviation, description, isActive } = command;

    const finish = await this.finishRepository.findById(FinishId.create(id));
    if (!finish) {
      throw new ResourceNotFoundException('Finish', id);
    }

    if (name !== undefined) {
      const existing = await this.finishRepository.findByName(name);
      if (existing && existing.id.getValue() !== id) {
        throw new ConflictException(
          `Finish with name "${name}" already exists`,
        );
      }
      finish.updateName(name);
    }

    if (abbreviation !== undefined) {
      finish.updateAbbreviation(abbreviation);
    }

    if (description !== undefined) {
      finish.updateDescription(description);
    }

    if (isActive !== undefined) {
      finish.setActive(isActive);
    }

    await this.finishRepository.save(finish);
  }
}
