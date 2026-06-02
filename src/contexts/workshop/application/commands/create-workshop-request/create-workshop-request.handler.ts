import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateWorkshopRequestCommand } from './create-workshop-request.command';
import { IWorkshopRequestRepository } from '../../../domain/repositories/iworkshop-request.repository';
import { IMaterialRepository } from '../../../domain/repositories/imaterial.repository';
import { IToolRepository } from '../../../domain/repositories/itool.repository';
import { WorkshopRequest } from '../../../domain/entities/workshop-request.entity';
import { RequestType } from '../../../domain/enums/request-type.enum';
import { MaterialId } from '../../../domain/value-objects/material-id';
import { ToolId } from '../../../domain/value-objects/tool-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@CommandHandler(CreateWorkshopRequestCommand)
export class CreateWorkshopRequestHandler implements ICommandHandler<CreateWorkshopRequestCommand> {
  constructor(
    @Inject(WORKSHOP_TOKENS.REQUEST_REPOSITORY)
    private readonly requestRepository: IWorkshopRequestRepository,
    @Inject(WORKSHOP_TOKENS.MATERIAL_REPOSITORY)
    private readonly materialRepository: IMaterialRepository,
    @Inject(WORKSHOP_TOKENS.TOOL_REPOSITORY)
    private readonly toolRepository: IToolRepository,
  ) {}

  async execute(command: CreateWorkshopRequestCommand): Promise<void> {
    const {
      requestType,
      itemId,
      requestedBy,
      priority,
      quantity,
      jobId,
      notes,
    } = command;

    if (requestType === RequestType.MATERIAL) {
      const material = await this.materialRepository.findById(
        MaterialId.create(itemId),
      );
      if (!material) throw new ResourceNotFoundException('Material', itemId);
    } else {
      const tool = await this.toolRepository.findById(ToolId.create(itemId));
      if (!tool) throw new ResourceNotFoundException('Tool', itemId);
    }

    const request = WorkshopRequest.create(
      requestType,
      itemId,
      requestedBy,
      priority,
      quantity,
      jobId,
      notes,
    );

    await this.requestRepository.save(request);
  }
}
