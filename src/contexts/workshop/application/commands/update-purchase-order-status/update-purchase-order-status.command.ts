export enum PurchaseOrderStatusAction {
  SEND = 'SEND',
  RECEIVE = 'RECEIVE',
  CANCEL = 'CANCEL',
}

export class UpdatePurchaseOrderStatusCommand {
  constructor(
    public readonly orderId: string,
    public readonly action: PurchaseOrderStatusAction,
    public readonly userId: string,
  ) {}
}
