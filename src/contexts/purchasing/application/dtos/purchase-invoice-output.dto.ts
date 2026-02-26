import { ApiProperty } from '@nestjs/swagger';
import { PurchaseInvoiceStatus } from '../../domain/enums/purchase-invoice-status.enum';
import { InvoiceItemConcept } from '../../domain/enums/invoice-item-concept.enum';

export class PurchaseInvoiceItemOutputDto {
  @ApiProperty({ example: 'uuid-item' })
  id: string;

  @ApiProperty({ example: 'uuid-bundle' })
  bundleId: string;

  @ApiProperty({
    enum: InvoiceItemConcept,
    example: InvoiceItemConcept.MATERIAL,
  })
  concept: InvoiceItemConcept;

  @ApiProperty({ example: 'Granito Blanco Polar - Bundle LOT-001' })
  description: string;

  @ApiProperty({ example: 2000.0 })
  unitCost: number;

  @ApiProperty({ example: 1 })
  quantity: number;

  @ApiProperty({ example: 2000.0 })
  totalCost: number;
}

export class PurchaseInvoiceOutputDto {
  @ApiProperty({ example: 'uuid-invoice' })
  id: string;

  @ApiProperty({ example: 'INV-2026-001' })
  invoiceNumber: string;

  @ApiProperty({ example: 'uuid-supplier' })
  supplierId: string;

  @ApiProperty({ example: '2026-01-15' })
  invoiceDate: string;

  @ApiProperty({ example: '2026-02-15', nullable: true })
  dueDate: string | null;

  @ApiProperty({ example: 5000.0 })
  subtotal: number;

  @ApiProperty({ example: 400.0 })
  taxAmount: number;

  @ApiProperty({ example: 5400.0 })
  totalAmount: number;

  @ApiProperty({
    enum: PurchaseInvoiceStatus,
    example: PurchaseInvoiceStatus.DRAFT,
  })
  status: PurchaseInvoiceStatus;

  @ApiProperty({ example: 'Factura de material importado' })
  notes: string;

  @ApiProperty({ example: 'uuid-user' })
  createdBy: string;

  @ApiProperty({ example: 'uuid-user' })
  updatedBy: string;

  @ApiProperty({ example: '2026-01-15T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-01-15T00:00:00.000Z' })
  updatedAt: string;

  @ApiProperty({ example: 3 })
  itemCount: number;
}

export class PurchaseInvoiceDetailOutputDto extends PurchaseInvoiceOutputDto {
  @ApiProperty({ type: [PurchaseInvoiceItemOutputDto] })
  items: PurchaseInvoiceItemOutputDto[];
}
