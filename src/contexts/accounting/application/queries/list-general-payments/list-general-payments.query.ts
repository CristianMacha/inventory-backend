import { PaymentType } from '../../../domain/enums/payment-type.enum';
import { PaymentCategory } from '../../../domain/enums/payment-category.enum';
import { PaymentMethod } from '../../../domain/enums/payment-method.enum';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

export class ListGeneralPaymentsQuery {
  constructor(
    public readonly pagination: PaginationParams,
    public readonly type?: PaymentType,
    public readonly category?: PaymentCategory,
    public readonly paymentMethod?: PaymentMethod,
    public readonly fromDate?: Date,
    public readonly toDate?: Date,
  ) {}
}
