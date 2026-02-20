import { ApiProperty } from '@nestjs/swagger';

class MetricsDto {
  @ApiProperty({ description: 'Total number of products', example: 42 })
  totalProducts: number;

  @ApiProperty({ description: 'Total number of brands', example: 12 })
  totalBrands: number;

  @ApiProperty({ description: 'Total number of categories', example: 8 })
  totalCategories: number;

  @ApiProperty({ description: 'Total number of bundles', example: 15 })
  totalBundles: number;

  @ApiProperty({ description: 'Total number of slabs', example: 150 })
  totalSlabs: number;
}

export class DashboardSummaryDto {
  @ApiProperty({ description: 'Dashboard metrics', type: MetricsDto })
  metrics: MetricsDto;
}
