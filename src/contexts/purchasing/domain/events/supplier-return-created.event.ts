export class SupplierReturnCreatedEvent {
  constructor(
    public readonly returnId: string,
    public readonly purchaseInvoiceId: string,
    public readonly supplierId: string,
    public readonly createdBy: string,
  ) {}
}
