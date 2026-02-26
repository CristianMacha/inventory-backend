export class PayInvoiceCommand {
  constructor(
    public readonly invoiceId: string,
    public readonly userId: string,
  ) {}
}
