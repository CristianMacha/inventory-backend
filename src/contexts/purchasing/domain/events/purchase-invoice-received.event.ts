export class PurchaseInvoiceReceivedEvent {
  constructor(
    public readonly invoiceId: string,
    public readonly supplierId: string,
    public readonly bundleIds: string[],
  ) {}
}
