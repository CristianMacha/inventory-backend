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
import { IJobRepository } from '@contexts/projects/domain/repositories/job.repository';
import { PROJECTS_TOKENS } from '@contexts/projects/application/projects.tokens';
import { IPurchaseInvoiceRepository } from '@contexts/purchasing/domain/repositories/purchase-invoice.repository';
import { PURCHASING_TOKENS } from '@contexts/purchasing/application/purchasing.tokens';

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
    @Inject(PROJECTS_TOKENS.JOB_REPOSITORY)
    private readonly jobRepository: IJobRepository,
    @Inject(PURCHASING_TOKENS.PURCHASE_INVOICE_REPOSITORY)
    private readonly purchaseInvoiceRepository: IPurchaseInvoiceRepository,
  ) {}

  async execute(): Promise<DashboardSummaryDto> {
    const [
      totalProducts,
      totalBrands,
      totalCategories,
      totalBundles,
      totalSlabs,
      totalJobs,
      totalPurchaseInvoices,
    ] = await Promise.all([
      this.productRepository.count(),
      this.brandRepository.count(),
      this.categoryRepository.count(),
      this.bundleRepository.count(),
      this.slabRepository.count(),
      this.jobRepository.count(),
      this.purchaseInvoiceRepository.count(),
    ]);

    return {
      inventory: {
        totalProducts,
        totalBrands,
        totalCategories,
        totalBundles,
        totalSlabs,
      },
      projects: {
        totalJobs,
      },
      purchasing: {
        totalPurchaseInvoices,
      },
    };
  }
}
