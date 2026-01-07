import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ConflictException, Inject } from "@nestjs/common";

import { CreateCategoryCommand } from "./create-cateogry.command";
import { ICategoryRepository } from "@contexts/inventory/domain/repositories/category.repository";
import { Category } from "@contexts/inventory/domain/entities/category";

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler implements ICommandHandler<CreateCategoryCommand> {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
  ) { }

  async execute(command: CreateCategoryCommand): Promise<void> {
    const { name, description, createdBy } = command;

    const existingCategory = await this.categoryRepository.findByName(name);
    if (existingCategory) {
      throw new ConflictException(`Category with name ${name} already exists`);
    }

    const category = Category.create(name, description || '', createdBy);
    await this.categoryRepository.save(category);
  }
}