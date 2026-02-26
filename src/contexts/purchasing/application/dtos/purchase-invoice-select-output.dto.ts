import { ApiProperty } from '@nestjs/swagger';
import { PurchaseInvoiceStatus } from '../../domain/enums/purchase-invoice-status.enum';

export class PurchaseInvoiceSelectOutputDto {
  @ApiProperty({ example: 'uuid-invoice' })
  id: string;

  @ApiProperty({ example: 'INV-2026-001' })
  invoiceNumber: string;

  @ApiProperty({ example: 'uuid-supplier' })
  supplierId: string;

  @ApiProperty({ example: '2026-01-15' })
  invoiceDate: string;

  @ApiProperty({ enum: PurchaseInvoiceStatus, example: PurchaseInvoiceStatus.RECEIVED })
  status: PurchaseInvoiceStatus;
}
