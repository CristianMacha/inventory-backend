import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductSupplierOutputDto {
  @ApiProperty({ example: 'uuid-product-supplier' })
  id: string;

  @ApiProperty({ example: 'uuid-supplier' })
  supplierId: string;

  @ApiProperty({ example: 'Proveedor ABC' })
  supplierName: string;

  @ApiPropertyOptional({ example: 'ABC', nullable: true })
  supplierAbbreviation: string | null;

  @ApiProperty({ example: true })
  isPrimary: boolean;
}
