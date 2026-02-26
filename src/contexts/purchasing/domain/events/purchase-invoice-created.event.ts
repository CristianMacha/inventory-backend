export class PurchaseInvoiceCreatedEvent {
  constructor(
    public readonly invoiceId: string,
    public readonly invoiceNumber: string,
    public readonly supplierId: string,
    public readonly createdBy: string,
  ) {}
}
