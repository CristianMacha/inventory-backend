import { ApiProperty } from '@nestjs/swagger';

class InventoryMetricsDto {
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

class ProjectsMetricsDto {
  @ApiProperty({ description: 'Total number of jobs', example: 10 })
  totalJobs: number;
}

class PurchasingMetricsDto {
  @ApiProperty({ description: 'Total number of purchase invoices', example: 5 })
  totalPurchaseInvoices: number;
}

export class DashboardSummaryDto {
  @ApiProperty({ description: 'Inventory metrics', type: InventoryMetricsDto })
  inventory: InventoryMetricsDto;

  @ApiProperty({ description: 'Projects metrics', type: ProjectsMetricsDto })
  projects: ProjectsMetricsDto;

  @ApiProperty({ description: 'Purchasing metrics', type: PurchasingMetricsDto })
  purchasing: PurchasingMetricsDto;
}
