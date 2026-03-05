import { PaymentMethod } from '../../../domain/enums/payment-method.enum';

export class RecordInvoicePaymentCommand {
  constructor(
    public readonly invoiceId: string,
    public readonly amount: number,
    public readonly paymentMethod: PaymentMethod,
    public readonly paymentDate: Date,
    public readonly reference: string | null,
    public readonly userId: string,
  ) {}
}
