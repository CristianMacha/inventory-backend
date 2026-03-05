import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentType } from '../../domain/enums/payment-type.enum';
import { PaymentCategory } from '../../domain/enums/payment-category.enum';
import { PaymentMethod } from '../../domain/enums/payment-method.enum';

export class GeneralPaymentOutputDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: PaymentType })
  type: PaymentType;

  @ApiProperty({ enum: PaymentCategory })
  category: PaymentCategory;

  @ApiPropertyOptional({ nullable: true })
  description: string | null;

  @ApiProperty({ example: 1500.0 })
  amount: number;

  @ApiProperty({ enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @ApiProperty({ example: '2026-03-04' })
  paymentDate: string;

  @ApiPropertyOptional({ nullable: true })
  reference: string | null;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  createdAt: string;
}

export class GeneralPaymentsPageDto {
  @ApiProperty({ type: [GeneralPaymentOutputDto] })
  payments: GeneralPaymentOutputDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
