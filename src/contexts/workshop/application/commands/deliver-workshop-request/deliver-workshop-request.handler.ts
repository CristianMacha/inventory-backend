import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { DeliverWorkshopRequestCommand } from './deliver-workshop-request.command';
import { IWorkshopRequestRepository } from '../../../domain/repositories/iworkshop-request.repository';
import { IMaterialMovementRepository } from '../../../domain/repositories/imaterial-movement.repository';
import { IToolRepository } from '../../../domain/repositories/itool.repository';
import { WorkshopRequestId } from '../../../domain/value-objects/workshop-request-id';
import { ToolId } from '../../../domain/value-objects/tool-id';
import { MaterialMovement } from '../../../domain/entities/material-movement.entity';
import { MaterialMovementReason } from '../../../domain/enums/material-movement-reason.enum';
import { RequestType } from '../../../domain/enums/request-type.enum';
import { ToolStatus } from '../../../domain/enums/tool-status.enum';
import { InsufficientMaterialStockException } from '../../../domain/errors/workshop.errors';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@CommandHandler(DeliverWorkshopRequestCommand)
export class DeliverWorkshopRequestHandler implements ICommandHandler<DeliverWorkshopRequestCommand> {
  constructor(
    @Inject(WORKSHOP_TOKENS.REQUEST_REPOSITORY)
    private readonly requestRepository: IWorkshopRequestRepository,
    @Inject(WORKSHOP_TOKENS.MATERIAL_MOVEMENT_REPOSITORY)
    private readonly movementRepository: IMaterialMovementRepository,
    @Inject(WORKSHOP_TOKENS.TOOL_REPOSITORY)
    private readonly toolRepository: IToolRepository,
  ) {}

  async execute(command: DeliverWorkshopRequestCommand): Promise<void> {
    const request = await this.requestRepository.findById(
      WorkshopRequestId.create(command.requestId),
    );
    if (!request) {
      throw new NotFoundException('Workshop request not found');
    }

    request.deliver(command.deliveredBy);

    if (request.requestType === RequestType.MATERIAL) {
      const deliveredQty = request.approvedQuantity ?? request.quantity!;
      const currentStock = await this.movementRepository.getStockForMaterial(
        request.itemId,
      );
      if (currentStock < deliveredQty) {
        throw new InsufficientMaterialStockException(
          currentStock,
          deliveredQty,
        );
      }
      await this.movementRepository.save(
        MaterialMovement.create(
          request.itemId,
          -deliveredQty,
          MaterialMovementReason.USO_JOB,
          command.deliveredBy,
          request.jobId ?? undefined,
          `Delivered for request ${request.id.getValue()}`,
        ),
      );
    } else {
      const tool = await this.toolRepository.findById(
        ToolId.create(request.itemId),
      );
      if (tool) {
        tool.update(
          command.deliveredBy,
          undefined,
          undefined,
          ToolStatus.IN_USE,
        );
        await this.toolRepository.save(tool);
      }
    }

    await this.requestRepository.save(request);
  }
}
