import { ApiProperty } from '@nestjs/swagger';

export class SlabStatusCountDto {
  @ApiProperty({ example: 10 })
  available: number;

  @ApiProperty({ example: 3 })
  reserved: number;

  @ApiProperty({ example: 5 })
  sold: number;

  @ApiProperty({ example: 1 })
  returning: number;

  @ApiProperty({ example: 2 })
  returned: number;
}

export class ProductInventorySummaryDto {
  @ApiProperty({ example: 'uuid-product' })
  productId: string;

  @ApiProperty({ example: 'Marble Calacatta' })
  productName: string;

  @ApiProperty({ example: 3 })
  bundleCount: number;

  @ApiProperty({ example: 21 })
  totalSlabs: number;

  @ApiProperty({
    type: SlabStatusCountDto,
    description: 'Slab counts by status',
  })
  slabsByStatus: SlabStatusCountDto;

  @ApiProperty({
    example: 42.5,
    description: 'Available area in square meters',
  })
  availableAreaM2: number;

  @ApiProperty({
    example: 85.3,
    description: 'Total area in square meters (all statuses)',
  })
  totalAreaM2: number;
}

export class InventorySummaryOutputDto {
  @ApiProperty({ type: [ProductInventorySummaryDto] })
  products: ProductInventorySummaryDto[];

  @ApiProperty({ example: 150 })
  totalProducts: number;

  @ApiProperty({ example: 45 })
  totalBundles: number;

  @ApiProperty({ example: 320 })
  totalSlabs: number;

  @ApiProperty({
    example: 640.5,
    description: 'Total available area in square meters',
  })
  totalAvailableAreaM2: number;
}
