import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateWorkshopPurchaseOrderCommand } from './create-workshop-purchase-order.command';
import { IWorkshopPurchaseOrderRepository } from '../../../domain/repositories/iworkshop-purchase-order.repository';
import { WorkshopPurchaseOrder } from '../../../domain/entities/workshop-purchase-order.entity';
import { WorkshopPurchaseOrderItem } from '../../../domain/entities/workshop-purchase-order-item';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@CommandHandler(CreateWorkshopPurchaseOrderCommand)
export class CreateWorkshopPurchaseOrderHandler implements ICommandHandler<CreateWorkshopPurchaseOrderCommand> {
  constructor(
    @Inject(WORKSHOP_TOKENS.PURCHASE_ORDER_REPOSITORY)
    private readonly repository: IWorkshopPurchaseOrderRepository,
  ) {}

  async execute(command: CreateWorkshopPurchaseOrderCommand): Promise<void> {
    const items = command.items.map((i) =>
      WorkshopPurchaseOrderItem.create(
        i.materialId,
        i.materialName,
        i.purchaseQuantity,
        i.requestedQuantity,
        i.unitCost,
      ),
    );

    const order = WorkshopPurchaseOrder.create(
      command.supplierId,
      items,
      command.createdBy,
      command.notes,
    );

    await this.repository.save(order);
  }
}
