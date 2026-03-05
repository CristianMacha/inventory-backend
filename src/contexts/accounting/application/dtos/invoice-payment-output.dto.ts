import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../../domain/enums/payment-method.enum';

export class InvoicePaymentOutputDto {
  @ApiProperty({ example: 'uuid-payment' })
  id: string;

  @ApiProperty({ example: 'uuid-invoice' })
  invoiceId: string;

  @ApiProperty({ example: 500.0 })
  amount: number;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CASH })
  paymentMethod: PaymentMethod;

  @ApiProperty({ example: '2026-03-03' })
  paymentDate: string;

  @ApiProperty({ example: 'TRF-001', nullable: true })
  reference: string | null;

  @ApiProperty({ example: 'uuid-user' })
  createdBy: string;

  @ApiProperty({ example: '2026-03-03T10:00:00.000Z' })
  createdAt: string;
}

export class InvoicePaymentsWithSummaryDto {
  @ApiProperty({ type: [InvoicePaymentOutputDto] })
  payments: InvoicePaymentOutputDto[];

  @ApiProperty({ example: 500.0 })
  totalPaid: number;

  @ApiProperty({ example: 1500.0 })
  remaining: number;

  @ApiProperty({ example: 2000.0 })
  invoiceTotalAmount: number;
}

export class InvoicePaymentWithContextOutputDto {
  @ApiProperty({ example: 'uuid-payment' })
  id: string;

  @ApiProperty({ example: 'uuid-invoice' })
  invoiceId: string;

  @ApiProperty({ example: 'INV-0042' })
  invoiceNumber: string;

  @ApiProperty({ example: 500.0 })
  amount: number;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CASH })
  paymentMethod: PaymentMethod;

  @ApiProperty({ example: '2026-03-03' })
  paymentDate: string;

  @ApiProperty({ example: 'TRF-001', nullable: true })
  reference: string | null;

  @ApiProperty({ example: 'uuid-user' })
  createdBy: string;

  @ApiProperty({ example: '2026-03-03T10:00:00.000Z' })
  createdAt: string;
}

export class InvoicePaymentsPageDto {
  @ApiProperty({ type: [InvoicePaymentWithContextOutputDto] })
  payments: InvoicePaymentWithContextOutputDto[];

  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}
