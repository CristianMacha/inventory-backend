import { PaymentType } from '../../../domain/enums/payment-type.enum';
import { PaymentCategory } from '../../../domain/enums/payment-category.enum';
import { PaymentMethod } from '../../../domain/enums/payment-method.enum';

export class RecordGeneralPaymentCommand {
  constructor(
    public readonly type: PaymentType,
    public readonly category: PaymentCategory,
    public readonly description: string | null,
    public readonly amount: number,
    public readonly paymentMethod: PaymentMethod,
    public readonly paymentDate: Date,
    public readonly reference: string | null,
    public readonly userId: string,
  ) {}
}
