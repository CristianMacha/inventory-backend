import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateWorkshopCategoryCommand } from './update-workshop-category.command';
import { IWorkshopCategoryRepository } from '../../../domain/repositories/iworkshop-category.repository';
import { WorkshopCategoryId } from '../../../domain/value-objects/workshop-category-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@CommandHandler(UpdateWorkshopCategoryCommand)
export class UpdateWorkshopCategoryHandler implements ICommandHandler<UpdateWorkshopCategoryCommand> {
  constructor(
    @Inject(WORKSHOP_TOKENS.CATEGORY_REPOSITORY)
    private readonly categoryRepository: IWorkshopCategoryRepository,
  ) {}

  async execute(command: UpdateWorkshopCategoryCommand): Promise<void> {
    const category = await this.categoryRepository.findById(WorkshopCategoryId.create(command.id));
    if (!category) throw new ResourceNotFoundException('WorkshopCategory', command.id);
    category.update(command.name, command.description);
    await this.categoryRepository.save(category);
  }
}
