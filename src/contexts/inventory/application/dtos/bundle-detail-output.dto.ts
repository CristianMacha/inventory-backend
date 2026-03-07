import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ISlabOutputDto } from './slab-output.dto';

export class BundleDetailOutputDto {
  @ApiProperty({ example: 'uuid-bundle' })
  id: string;

  @ApiProperty({ example: 'uuid-product' })
  productId: string;

  @ApiProperty({ example: 'Granito Blanco Polar' })
  productName: string;

  @ApiProperty({ example: 'uuid-supplier' })
  supplierId: string;

  @ApiProperty({ example: 'Proveedor ABC' })
  supplierName: string;

  @ApiProperty({ example: 'LOT-001' })
  lotNumber: string;

  @ApiProperty({ example: 2.5 })
  thicknessCm: number;

  @ApiPropertyOptional({ example: 'uuid-invoice', nullable: true })
  purchaseInvoiceId: string | null;

  @ApiPropertyOptional({ example: 'INV-2026-001', nullable: true })
  invoiceNumber: string | null;

  @ApiPropertyOptional({ example: 'bundles/abc123', nullable: true })
  imagePublicId: string | null;

  @ApiProperty({ type: [ISlabOutputDto] })
  slabs: ISlabOutputDto[];

  @ApiProperty({ example: 'uuid-user' })
  createdBy: string;

  @ApiProperty({ example: 'uuid-user' })
  updatedBy: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: string;
}
