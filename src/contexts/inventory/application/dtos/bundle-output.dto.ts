import { ApiProperty } from '@nestjs/swagger';

export class IBundleOutputDto {
  @ApiProperty({ example: 'uuid-here' })
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

  @ApiProperty({ example: 'uuid-user' })
  createdBy: string;

  @ApiProperty({ example: 'uuid-user' })
  updatedBy: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: string;
}
