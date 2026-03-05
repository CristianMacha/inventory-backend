import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../../domain/enums/payment-method.enum';

export class JobPaymentOutputDto {
  @ApiProperty({ example: 'uuid-payment' })
  id: string;

  @ApiProperty({ example: 'uuid-job' })
  jobId: string;

  @ApiProperty({ example: 1200.0 })
  amount: number;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.BANK_TRANSFER })
  paymentMethod: PaymentMethod;

  @ApiProperty({ example: '2026-03-03' })
  paymentDate: string;

  @ApiProperty({ example: 'TRF-002', nullable: true })
  reference: string | null;

  @ApiProperty({ example: 'uuid-user' })
  createdBy: string;

  @ApiProperty({ example: '2026-03-03T10:00:00.000Z' })
  createdAt: string;
}

export class JobPaymentsWithSummaryDto {
  @ApiProperty({ type: [JobPaymentOutputDto] })
  payments: JobPaymentOutputDto[];

  @ApiProperty({ example: 1200.0 })
  totalPaid: number;

  @ApiProperty({ example: 1200.0 })
  remaining: number;

  @ApiProperty({ example: 2400.0 })
  jobTotalAmount: number;
}

export class JobPaymentWithContextOutputDto {
  @ApiProperty({ example: 'uuid-payment' })
  id: string;

  @ApiProperty({ example: 'uuid-job' })
  jobId: string;

  @ApiProperty({ example: 'Kitchen Renovation' })
  projectName: string;

  @ApiProperty({ example: 1200.0 })
  amount: number;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.BANK_TRANSFER })
  paymentMethod: PaymentMethod;

  @ApiProperty({ example: '2026-03-03' })
  paymentDate: string;

  @ApiProperty({ example: 'TRF-002', nullable: true })
  reference: string | null;

  @ApiProperty({ example: 'uuid-user' })
  createdBy: string;

  @ApiProperty({ example: '2026-03-03T10:00:00.000Z' })
  createdAt: string;
}

export class JobPaymentsPageDto {
  @ApiProperty({ type: [JobPaymentWithContextOutputDto] })
  payments: JobPaymentWithContextOutputDto[];

  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}
