import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ConflictException, Inject } from "@nestjs/common";

import { CreateBrandCommand } from "./create-brand.command";
import { IBrandRepository } from "@contexts/inventory/domain/repositories/brand.repository";
import { Brand } from "@contexts/inventory/domain/entities/brand";

@CommandHandler(CreateBrandCommand)
export class CreateBrandHandler implements ICommandHandler<CreateBrandCommand> {
  constructor(
    @Inject('BrandRepository')
    private readonly brandRepository: IBrandRepository,
  ) { }

  async execute(command: CreateBrandCommand): Promise<void> {
    const { name, description, createdBy } = command;

    const existingBrand = await this.brandRepository.findByName(name);
    if (existingBrand) {
      throw new ConflictException(`Brand with name ${name} already exists`);
    }

    const brand = Brand.create(name, description || '', createdBy);
    await this.brandRepository.save(brand);
  }
}