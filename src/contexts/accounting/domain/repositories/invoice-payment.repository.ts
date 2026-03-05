import { InvoicePayment } from '../entities/invoice-payment';
import { PaymentMethod } from '../enums/payment-method.enum';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

export interface InvoicePaymentFilters {
  paymentMethod?: PaymentMethod;
  fromDate?: Date;
  toDate?: Date;
}

export interface InvoicePaymentWithContext {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  reference: string | null;
  createdBy: string;
  createdAt: Date;
}

export interface IInvoicePaymentRepository {
  save(payment: InvoicePayment): Promise<void>;
  findByInvoiceId(invoiceId: string): Promise<InvoicePayment[]>;
  findPaginated(
    filters: InvoicePaymentFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<InvoicePayment>>;
  findPaginatedWithContext(
    filters: InvoicePaymentFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<InvoicePaymentWithContext>>;
  sumByInvoiceId(invoiceId: string): Promise<number>;
  sumAll(fromDate?: Date, toDate?: Date): Promise<number>;
}
