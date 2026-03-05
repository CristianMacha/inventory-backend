export class InvoicePaymentRecordedEvent {
  constructor(
    public readonly invoiceId: string,
    public readonly paymentAmount: number,
    public readonly userId: string,
  ) {}
}
