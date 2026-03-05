import { forwardRef, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedInfrastructureModule } from '@shared/infrastructure/shared-infrastructure.module';
import { INVENTORY_TOKENS } from './inventory.tokens';
import { PurchasingModule } from '@contexts/purchasing/purchasing.module';

import { ProductEntity } from './infrastructure/persistence/typeorm/entities/product.entity';
import { CategoryEntity } from './infrastructure/persistence/typeorm/entities/category.entity';
import { BrandEntity } from './infrastructure/persistence/typeorm/entities/brand.entity';
import { BundleEntity } from './infrastructure/persistence/typeorm/entities/bundle.entity';
import { SlabEntity } from './infrastructure/persistence/typeorm/entities/slab.entity';
import { LevelEntity } from './infrastructure/persistence/typeorm/entities/level.entity';
import { FinishEntity } from './infrastructure/persistence/typeorm/entities/finish.entity';
import { SupplierEntity } from './infrastructure/persistence/typeorm/entities/supplier.entity';
import { ProductSupplierEntity } from './infrastructure/persistence/typeorm/entities/product-supplier.entity';

import { TypeOrmBrandRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-brand.repository';
import { TypeOrmCategoryRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-category.repository';
import { TypeOrmProductRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-product.repository';
import { TypeOrmBundleRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-bundle.repository';
import { TypeOrmSlabRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-slab.repository';
import { TypeOrmLevelRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-level.repository';
import { TypeOrmFinishRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-finish.repository';
import { TypeOrmSupplierRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-supplier.repository';
import { TypeOrmProductSupplierRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-product-supplier.repository';

import { CreateBrandHandler } from './application/commands/create-brand/create-brand.handler';
import { CreateCategoryHandler } from './application/commands/create-category/create-category.handler';
import { CreateProductHandler } from './application/commands/create-product/create-product.handler';
import { UpdateProductHandler } from './application/commands/update-product/update-product.handler';
import { UpdateBrandHandler } from './application/commands/update-brand/update-brand.handler';
import { UpdateCategoryHandler } from './application/commands/update-category/update-category.handler';
import { UpdateBundleHandler } from './application/commands/update-bundle/update-bundle.handler';
import { UpdateSlabHandler } from './application/commands/update-slab/update-slab.handler';
import { GetBrandsHandler } from './application/queries/get-brands/get-brands.handler';
import { GetCategoriesHandler } from './application/queries/get-categories/get-categories.handler';
import { GetProductsHandler } from './application/queries/get-products/get-products.handler';
import { GetProductByIdHandler } from './application/queries/get-product-by-id/get-product-by-id.handler';
import { GetBrandsController } from './infrastructure/http/controllers/get-brands.controller';
import { GetCategoriesController } from './infrastructure/http/controllers/get-category.controller';
import { GetProductsController } from './infrastructure/http/controllers/get-products.controller';
import { CreateBrandController } from './infrastructure/http/controllers/create-brand.controller';
import { CreateCategoryController } from './infrastructure/http/controllers/create-category.controller';
import { CreateProductController } from './infrastructure/http/controllers/create-product.controller';
import { UpdateProductController } from './infrastructure/http/controllers/update-product.controller';
import { UpdateBrandController } from './infrastructure/http/controllers/update-brand.controller';
import { UpdateCategoryController } from './infrastructure/http/controllers/update-category.controller';
import { UpdateBundleController } from './infrastructure/http/controllers/update-bundle.controller';
import { UpdateSlabController } from './infrastructure/http/controllers/update-slab.controller';
import { CreateBundleController } from './infrastructure/http/controllers/create-bundle.controller';
import { GetBundlesController } from './infrastructure/http/controllers/get-bundles.controller';
import { CreateSlabController } from './infrastructure/http/controllers/create-slab.controller';
import { GetSlabsController } from './infrastructure/http/controllers/get-slabs.controller';

import { GetBundlesHandler } from './application/queries/get-bundles/get-bundles.handler';
import { GetProductDetailHandler } from './application/queries/get-product-detail/get-product-detail.handler';
import { GetSlabsHandler } from './application/queries/get-slabs/get-slabs.handler';
import { GetLevelsHandler } from './application/queries/get-levels/get-levels.handler';
import { GetFinishesHandler } from './application/queries/get-finishes/get-finishes.handler';
import { GetSuppliersHandler } from './application/queries/get-suppliers/get-suppliers.handler';
import { GetActiveBrandsHandler } from './application/queries/get-active-brands/get-active-brands.handler';
import { GetActiveCategoriesHandler } from './application/queries/get-active-categories/get-active-categories.handler';
import { GetActiveLevelsHandler } from './application/queries/get-active-levels/get-active-levels.handler';
import { GetActiveFinishesHandler } from './application/queries/get-active-finishes/get-active-finishes.handler';
import { GetActiveSuppliersHandler } from './application/queries/get-active-suppliers/get-active-suppliers.handler';
import { CreateBundleHandler } from './application/commands/create-bundle/create-bundle.handler';
import { CreateSlabHandler } from './application/commands/create-slab/create-slab.handler';
import { CreateBundleWithSlabsHandler } from './application/commands/create-bundle-with-slabs/create-bundle-with-slabs.handler';
import { LinkBundleInvoiceHandler } from './application/commands/link-bundle-invoice/link-bundle-invoice.handler';
import { UnlinkBundleInvoiceHandler } from './application/commands/unlink-bundle-invoice/unlink-bundle-invoice.handler';
import { CreateRemnantSlabHandler } from './application/commands/create-remnant-slab/create-remnant-slab.handler';
import { CreateBundleWithSlabsController } from './infrastructure/http/controllers/create-bundle-with-slabs.controller';
import { GetLevelsController } from './infrastructure/http/controllers/get-levels.controller';
import { GetFinishesController } from './infrastructure/http/controllers/get-finishes.controller';
import { GetSuppliersController } from './infrastructure/http/controllers/get-suppliers.controller';
import { CreateFinishHandler } from './application/commands/create-finish/create-finish.handler';
import { UpdateFinishHandler } from './application/commands/update-finish/update-finish.handler';
import { CreateLevelHandler } from './application/commands/create-level/create-level.handler';
import { UpdateLevelHandler } from './application/commands/update-level/update-level.handler';
import { CreateSupplierHandler } from './application/commands/create-supplier/create-supplier.handler';
import { UpdateSupplierHandler } from './application/commands/update-supplier/update-supplier.handler';
import { CreateFinishController } from './infrastructure/http/controllers/create-finish.controller';
import { UpdateFinishController } from './infrastructure/http/controllers/update-finish.controller';
import { CreateLevelController } from './infrastructure/http/controllers/create-level.controller';
import { UpdateLevelController } from './infrastructure/http/controllers/update-level.controller';
import { CreateSupplierController } from './infrastructure/http/controllers/create-supplier.controller';
import { UpdateSupplierController } from './infrastructure/http/controllers/update-supplier.controller';

import { GetBundleDetailHandler } from './application/queries/get-bundle-detail/get-bundle-detail.handler';
import { GetBundleDetailController } from './infrastructure/http/controllers/get-bundle-detail.controller';
import { LinkBundleInvoiceController } from './infrastructure/http/controllers/link-bundle-invoice.controller';
import { UnlinkBundleInvoiceController } from './infrastructure/http/controllers/unlink-bundle-invoice.controller';
import { GetReturnableSlabsHandler } from './application/queries/get-returnable-slabs/get-returnable-slabs.handler';
import { GetProductsSelectHandler } from './application/queries/get-products-select/get-products-select.handler';
import { OnJobApprovedHandler } from './application/event-handlers/on-job-approved.handler';
import { OnJobCompletedHandler } from './application/event-handlers/on-job-completed.handler';
import { OnJobCancelledHandler } from './application/event-handlers/on-job-cancelled.handler';
import { OnSupplierReturnCreditedHandler } from './application/event-handlers/on-supplier-return-credited.handler';

const CommandHandlers = [
  CreateBrandHandler,
  CreateCategoryHandler,
  CreateProductHandler,
  UpdateProductHandler,
  UpdateBrandHandler,
  UpdateCategoryHandler,
  UpdateBundleHandler,
  UpdateSlabHandler,
  CreateBundleHandler,
  CreateSlabHandler,
  CreateBundleWithSlabsHandler,
  LinkBundleInvoiceHandler,
  UnlinkBundleInvoiceHandler,
  CreateFinishHandler,
  UpdateFinishHandler,
  CreateLevelHandler,
  UpdateLevelHandler,
  CreateSupplierHandler,
  UpdateSupplierHandler,
  CreateRemnantSlabHandler,
];

const QueryHandlers = [
  GetBrandsHandler,
  GetCategoriesHandler,
  GetProductsHandler,
  GetProductByIdHandler,
  GetBundlesHandler,
  GetSlabsHandler,
  GetProductDetailHandler,
  GetBundleDetailHandler,
  GetLevelsHandler,
  GetFinishesHandler,
  GetSuppliersHandler,
  GetActiveBrandsHandler,
  GetActiveCategoriesHandler,
  GetActiveLevelsHandler,
  GetActiveFinishesHandler,
  GetActiveSuppliersHandler,
  GetReturnableSlabsHandler,
  GetProductsSelectHandler,
];

const PersistenceProviders: Provider[] = [
  {
    provide: INVENTORY_TOKENS.BRAND_REPOSITORY,
    useClass: TypeOrmBrandRepository,
  },
  {
    provide: INVENTORY_TOKENS.CATEGORY_REPOSITORY,
    useClass: TypeOrmCategoryRepository,
  },
  {
    provide: INVENTORY_TOKENS.PRODUCT_REPOSITORY,
    useClass: TypeOrmProductRepository,
  },
  {
    provide: INVENTORY_TOKENS.BUNDLE_REPOSITORY,
    useClass: TypeOrmBundleRepository,
  },
  {
    provide: INVENTORY_TOKENS.SLAB_REPOSITORY,
    useClass: TypeOrmSlabRepository,
  },
  {
    provide: INVENTORY_TOKENS.LEVEL_REPOSITORY,
    useClass: TypeOrmLevelRepository,
  },
  {
    provide: INVENTORY_TOKENS.FINISH_REPOSITORY,
    useClass: TypeOrmFinishRepository,
  },
  {
    provide: INVENTORY_TOKENS.SUPPLIER_REPOSITORY,
    useClass: TypeOrmSupplierRepository,
  },
  {
    provide: INVENTORY_TOKENS.PRODUCT_SUPPLIER_REPOSITORY,
    useClass: TypeOrmProductSupplierRepository,
  },
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      ProductEntity,
      CategoryEntity,
      BrandEntity,
      BundleEntity,
      SlabEntity,
      LevelEntity,
      FinishEntity,
      SupplierEntity,
      ProductSupplierEntity,
    ]),
    SharedInfrastructureModule,
    forwardRef(() => PurchasingModule),
  ],
  controllers: [
    GetBrandsController,
    GetCategoriesController,
    GetProductsController,
    CreateBrandController,
    CreateCategoryController,
    CreateProductController,
    UpdateProductController,
    UpdateBrandController,
    UpdateCategoryController,
    UpdateBundleController,
    UpdateSlabController,
    CreateBundleController,
    GetBundlesController,
    CreateSlabController,
    GetSlabsController,
    GetLevelsController,
    GetFinishesController,
    GetSuppliersController,
    CreateBundleWithSlabsController,
    CreateFinishController,
    UpdateFinishController,
    CreateLevelController,
    UpdateLevelController,
    CreateSupplierController,
    UpdateSupplierController,
    GetBundleDetailController,
    LinkBundleInvoiceController,
    UnlinkBundleInvoiceController,
  ],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...PersistenceProviders,
    OnJobApprovedHandler,
    OnJobCompletedHandler,
    OnJobCancelledHandler,
    OnSupplierReturnCreditedHandler,
  ],
  exports: [...PersistenceProviders],
})
export class InventoryModule {}
