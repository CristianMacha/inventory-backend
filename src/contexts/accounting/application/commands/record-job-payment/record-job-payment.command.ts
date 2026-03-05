import { PaymentMethod } from '../../../domain/enums/payment-method.enum';

export class RecordJobPaymentCommand {
  constructor(
    public readonly jobId: string,
    public readonly amount: number,
    public readonly paymentMethod: PaymentMethod,
    public readonly paymentDate: Date,
    public readonly reference: string | null,
    public readonly userId: string,
  ) {}
}
