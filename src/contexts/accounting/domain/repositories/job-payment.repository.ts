import { JobPayment } from '../entities/job-payment';
import { PaymentMethod } from '../enums/payment-method.enum';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

export interface JobPaymentFilters {
  paymentMethod?: PaymentMethod;
  fromDate?: Date;
  toDate?: Date;
}

export interface JobPaymentWithContext {
  id: string;
  jobId: string;
  projectName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  reference: string | null;
  createdBy: string;
  createdAt: Date;
}

export interface IJobPaymentRepository {
  save(payment: JobPayment): Promise<void>;
  findByJobId(jobId: string): Promise<JobPayment[]>;
  findPaginated(
    filters: JobPaymentFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<JobPayment>>;
  findPaginatedWithContext(
    filters: JobPaymentFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<JobPaymentWithContext>>;
  sumByJobId(jobId: string): Promise<number>;
  sumAll(fromDate?: Date, toDate?: Date): Promise<number>;
}
