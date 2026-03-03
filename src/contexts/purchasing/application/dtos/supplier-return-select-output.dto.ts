import { ApiProperty } from '@nestjs/swagger';
import { SupplierReturnStatus } from '../../domain/enums/supplier-return-status.enum';

export class SupplierReturnSelectOutputDto {
  @ApiProperty({ example: 'uuid-return' })
  id: string;

  @ApiProperty({ example: 'uuid-supplier' })
  supplierId: string;

  @ApiProperty({ example: 'uuid-invoice' })
  purchaseInvoiceId: string;

  @ApiProperty({ example: '2026-01-20' })
  returnDate: string;

  @ApiProperty({
    enum: SupplierReturnStatus,
    example: SupplierReturnStatus.DRAFT,
  })
  status: SupplierReturnStatus;

  @ApiProperty({ example: 1500.0 })
  creditAmount: number;
}
