import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateWorkshopRequestCommand } from './create-workshop-request.command';
import { IWorkshopRequestRepository } from '../../../domain/repositories/iworkshop-request.repository';
import { WorkshopRequest } from '../../../domain/entities/workshop-request.entity';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@CommandHandler(CreateWorkshopRequestCommand)
export class CreateWorkshopRequestHandler implements ICommandHandler<CreateWorkshopRequestCommand> {
  constructor(
    @Inject(WORKSHOP_TOKENS.REQUEST_REPOSITORY)
    private readonly requestRepository: IWorkshopRequestRepository,
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
