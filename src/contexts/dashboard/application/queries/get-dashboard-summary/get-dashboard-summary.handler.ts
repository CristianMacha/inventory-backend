import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetDashboardSummaryQuery } from './get-dashboard-summary.query';
import { DashboardSummaryDto } from '../../dtos/dashboard-summary.dto';
import { IProductRepository } from '@contexts/inventory/domain/repositories/product.repository';
import { IBrandRepository } from '@contexts/inventory/domain/repositories/brand.repository';
import { ICategoryRepository } from '@contexts/inventory/domain/repositories/category.repository';
import { IBundleRepository } from '@contexts/inventory/domain/repositories/bundle.repository';
import { ISlabRepository } from '@contexts/inventory/domain/repositories/slab.repository';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@QueryHandler(GetDashboardSummaryQuery)
export class GetDashboardSummaryHandler implements IQueryHandler<GetDashboardSummaryQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(INVENTORY_TOKENS.BRAND_REPOSITORY)
    private readonly brandRepository: IBrandRepository,
    @Inject(INVENTORY_TOKENS.CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
    @Inject(INVENTORY_TOKENS.BUNDLE_REPOSITORY)
    private readonly bundleRepository: IBundleRepository,
    @Inject(INVENTORY_TOKENS.SLAB_REPOSITORY)
    private readonly slabRepository: ISlabRepository,
  ) {}

  async execute(): Promise<DashboardSummaryDto> {
    const [
      totalProducts,
      totalBrands,
      totalCategories,
      totalBundles,
      totalSlabs,
    ] = await Promise.all([
      this.productRepository.count(),
      this.brandRepository.count(),
      this.categoryRepository.count(),
      this.bundleRepository.count(),
      this.slabRepository.count(),
    ]);

    return {
      metrics: {
        totalProducts,
        totalBrands,
        totalCategories,
        totalBundles,
        totalSlabs,
      },
    };
  }
}
