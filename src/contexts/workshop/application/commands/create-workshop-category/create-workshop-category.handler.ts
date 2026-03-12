import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Inject } from '@nestjs/common';
import { CreateWorkshopCategoryCommand } from './create-workshop-category.command';
import { IWorkshopCategoryRepository } from '../../../domain/repositories/iworkshop-category.repository';
import { WorkshopCategory } from '../../../domain/entities/workshop-category.entity';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@CommandHandler(CreateWorkshopCategoryCommand)
export class CreateWorkshopCategoryHandler implements ICommandHandler<CreateWorkshopCategoryCommand> {
  constructor(
    @Inject(WORKSHOP_TOKENS.CATEGORY_REPOSITORY)
    private readonly categoryRepository: IWorkshopCategoryRepository,
  ) {}

  async execute(command: CreateWorkshopCategoryCommand): Promise<void> {
    const existing = await this.categoryRepository.findByName(command.name);
    if (existing) {
      throw new ConflictException(`Category with name "${command.name}" already exists`);
    }
    const category = WorkshopCategory.create(command.name, command.description);
    await this.categoryRepository.save(category);
  }
}
