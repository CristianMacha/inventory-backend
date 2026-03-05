import { GeneralPayment } from '../entities/general-payment';
import { PaymentType } from '../enums/payment-type.enum';
import { PaymentCategory } from '../enums/payment-category.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

export interface GeneralPaymentFilters {
  type?: PaymentType;
  category?: PaymentCategory;
  paymentMethod?: PaymentMethod;
  fromDate?: Date;
  toDate?: Date;
}

export interface IGeneralPaymentRepository {
  save(payment: GeneralPayment): Promise<void>;
  findPaginated(
    filters: GeneralPaymentFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<GeneralPayment>>;
  sumByType(type: PaymentType, fromDate?: Date, toDate?: Date): Promise<number>;
}
