import { PaymentMethod } from '../../../domain/enums/payment-method.enum';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

export class ListJobPaymentsQuery {
  constructor(
    public readonly pagination: PaginationParams,
    public readonly paymentMethod?: PaymentMethod,
    public readonly fromDate?: Date,
    public readonly toDate?: Date,
  ) {}
}
