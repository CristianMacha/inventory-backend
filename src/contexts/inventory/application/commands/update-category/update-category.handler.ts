import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Inject } from '@nestjs/common';

import { UpdateCategoryCommand } from './update-category.command';
import { ICategoryRepository } from '@contexts/inventory/domain/repositories/category.repository';
import { CategoryId } from '@contexts/inventory/domain/value-objects/category-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler implements ICommandHandler<UpdateCategoryCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(command: UpdateCategoryCommand): Promise<void> {
    const { id, name, description, updatedBy } = command;

    const category = await this.categoryRepository.findById(
      CategoryId.create(id),
    );
    if (!category) {
      throw new ResourceNotFoundException('Category', id);
    }

    if (name !== undefined) {
      const existing = await this.categoryRepository.findByName(name);
      if (existing && existing.id.getValue() !== id) {
        throw new ConflictException(
          `Category with name ${name} already exists`,
        );
      }
      category.updateName(name, updatedBy);
    }

    if (description !== undefined) {
      category.updateAbbreviation(description, updatedBy);
    }

    await this.categoryRepository.save(category);
  }
}
