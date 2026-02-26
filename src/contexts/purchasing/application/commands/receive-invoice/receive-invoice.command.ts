export class ReceiveInvoiceCommand {
  constructor(
    public readonly invoiceId: string,
    public readonly userId: string,
  ) {}
}
