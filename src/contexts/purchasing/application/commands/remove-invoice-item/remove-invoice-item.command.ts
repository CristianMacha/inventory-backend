export class RemoveInvoiceItemCommand {
  constructor(
    public readonly invoiceId: string,
    public readonly itemId: string,
    public readonly userId: string,
  ) {}
}
