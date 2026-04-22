import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ApproveWorkshopRequestCommand } from './approve-workshop-request.command';
import { IWorkshopRequestRepository } from '../../../domain/repositories/iworkshop-request.repository';
import { WorkshopRequestId } from '../../../domain/value-objects/workshop-request-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@CommandHandler(ApproveWorkshopRequestCommand)
export class ApproveWorkshopRequestHandler implements ICommandHandler<ApproveWorkshopRequestCommand> {
  constructor(
    @Inject(WORKSHOP_TOKENS.REQUEST_REPOSITORY)
    private readonly requestRepository: IWorkshopRequestRepository,
  ) {}

  async execute(command: ApproveWorkshopRequestCommand): Promise<void> {
    const { requestId, resolvedBy } = command;

    const request = await this.requestRepository.findById(
      WorkshopRequestId.create(requestId),
    );
    if (!request)
      throw new ResourceNotFoundException('WorkshopRequest', requestId);

    request.approve(resolvedBy);
    await this.requestRepository.save(request);
  }
}
