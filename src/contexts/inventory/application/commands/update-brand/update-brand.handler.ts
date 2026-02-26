import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Inject } from '@nestjs/common';

import { UpdateBrandCommand } from './update-brand.command';
import { IBrandRepository } from '@contexts/inventory/domain/repositories/brand.repository';
import { BrandId } from '@contexts/inventory/domain/value-objects/brand-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@CommandHandler(UpdateBrandCommand)
export class UpdateBrandHandler implements ICommandHandler<UpdateBrandCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.BRAND_REPOSITORY)
    private readonly brandRepository: IBrandRepository,
  ) {}

  async execute(command: UpdateBrandCommand): Promise<void> {
    const { id, name, description, isActive, updatedBy } = command;

    const brand = await this.brandRepository.findById(BrandId.create(id));
    if (!brand) {
      throw new ResourceNotFoundException('Brand', id);
    }

    if (name !== undefined) {
      const existing = await this.brandRepository.findByName(name);
      if (existing && existing.id.getValue() !== id) {
        throw new ConflictException(`Brand with name ${name} already exists`);
      }
      brand.updateName(name, updatedBy);
    }

    if (description !== undefined) {
      brand.updateDescription(description, updatedBy);
    }

    if (isActive !== undefined) {
      brand.setActive(isActive, updatedBy);
    }

    await this.brandRepository.save(brand);
  }
}
