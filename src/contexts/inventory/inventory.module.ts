import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedInfrastructureModule } from '@shared/infrastructure/shared-infrastructure.module';

import { ProductEntity } from './infrastructure/persistence/typeorm/entities/product.entity';
import { CategoryEntity } from './infrastructure/persistence/typeorm/entities/category.entity';
import { BrandEntity } from './infrastructure/persistence/typeorm/entities/brand.entity';
import { TypeOrmBrandRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-brand.repository';
import { TypeOrmCategoryRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-category.repository';
import { TypeOrmProductRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-product.repository';

import { CreateBrandHandler } from './application/commands/create-brand/create-brand.handler';
import { CreateCategoryHandler } from './application/commands/create-category/create-category.handler';
import { CreateProductHandler } from './application/commands/create-product/create-product.handler';
import { GetBrandsHandler } from './application/queries/get-brands/get-brands.handler';
import { GetCategoriesHandler } from './application/queries/get-categories/get-categories.handler';
import { GetProductsHandler } from './application/queries/get-products/get-products.handler';
import { GetBrandsController } from './infrastructure/http/controllers/get-brands.controller';
import { GetCategoriesController } from './infrastructure/http/controllers/get-category.controller';
import { GetProductsController } from './infrastructure/http/controllers/get-products.controller';
import { CreateBrandController } from './infrastructure/http/controllers/create-brand.controller';
import { CreateCategoryController } from './infrastructure/http/controllers/create-category.controller';
import { CreateProductController } from './infrastructure/http/controllers/create-product.controller';

const CommandHandlers = [
  CreateBrandHandler,
  CreateCategoryHandler,
  CreateProductHandler,
];

const QueryHandlers = [
  GetBrandsHandler,
  GetCategoriesHandler,
  GetProductsHandler,
];

const PersistenceProviders: Provider[] = [
  {
    provide: 'BrandRepository',
    useClass: TypeOrmBrandRepository,
  },
  {
    provide: 'CategoryRepository',
    useClass: TypeOrmCategoryRepository,
  },
  {
    provide: 'ProductRepository',
    useClass: TypeOrmProductRepository,
  },
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([ProductEntity, CategoryEntity, BrandEntity]),
    SharedInfrastructureModule,
  ],
  controllers: [
    GetBrandsController,
    GetCategoriesController,
    GetProductsController,
    CreateBrandController,
    CreateCategoryController,
    CreateProductController,
  ],
  providers: [...CommandHandlers, ...QueryHandlers, ...PersistenceProviders],
  exports: [...PersistenceProviders],
})
export class InventoryModule {}
