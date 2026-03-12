import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Inject } from '@nestjs/common';
import { CreateToolCommand } from './create-tool.command';
import { IToolRepository } from '../../../domain/repositories/itool.repository';
import { Tool } from '../../../domain/entities/tool.entity';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@CommandHandler(CreateToolCommand)
export class CreateToolHandler implements ICommandHandler<CreateToolCommand> {
  constructor(
    @Inject(WORKSHOP_TOKENS.TOOL_REPOSITORY)
    private readonly toolRepository: IToolRepository,
  ) {}

  async execute(command: CreateToolCommand): Promise<void> {
    const { name, createdBy, description, categoryId, supplierId, purchasePrice } = command;

    const existing = await this.toolRepository.findByName(name);
    if (existing) {
      throw new ConflictException(`Tool with name "${name}" already exists`);
    }

    const tool = Tool.create(name, createdBy, description, categoryId, supplierId, purchasePrice);
    await this.toolRepository.save(tool);
  }
}
