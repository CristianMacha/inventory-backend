import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  UpdatePurchaseOrderStatusCommand,
  PurchaseOrderStatusAction,
} from './update-purchase-order-status.command';
import { IWorkshopPurchaseOrderRepository } from '../../../domain/repositories/iworkshop-purchase-order.repository';
import { IMaterialMovementRepository } from '../../../domain/repositories/imaterial-movement.repository';
import { WorkshopPurchaseOrderId } from '../../../domain/value-objects/workshop-purchase-order-id';
import { MaterialMovement } from '../../../domain/entities/material-movement.entity';
import { MaterialMovementReason } from '../../../domain/enums/material-movement-reason.enum';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@CommandHandler(UpdatePurchaseOrderStatusCommand)
export class UpdatePurchaseOrderStatusHandler implements ICommandHandler<UpdatePurchaseOrderStatusCommand> {
  constructor(
    @Inject(WORKSHOP_TOKENS.PURCHASE_ORDER_REPOSITORY)
    private readonly repository: IWorkshopPurchaseOrderRepository,
    @Inject(WORKSHOP_TOKENS.MATERIAL_MOVEMENT_REPOSITORY)
    private readonly movementRepository: IMaterialMovementRepository,
  ) {}

  async execute(command: UpdatePurchaseOrderStatusCommand): Promise<void> {
    const order = await this.repository.findById(
      WorkshopPurchaseOrderId.create(command.orderId),
    );
    if (!order) {
      throw new NotFoundException('Purchase order not found');
    }

    switch (command.action) {
      case PurchaseOrderStatusAction.SEND:
        order.send(command.userId);
        break;
      case PurchaseOrderStatusAction.RECEIVE:
        order.receive(command.userId);
        await Promise.all(
          order.items.map((item) =>
            this.movementRepository.save(
              MaterialMovement.create(
                item.materialId,
                item.purchaseQuantity,
                MaterialMovementReason.COMPRA,
                command.userId,
                undefined,
                `Purchase order ${order.id.getValue()}`,
              ),
            ),
          ),
        );
        break;
      case PurchaseOrderStatusAction.CANCEL:
        order.cancel(command.userId);
        break;
    }

    await this.repository.save(order);
  }
}
