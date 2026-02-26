import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

import { UserEntity } from './src/contexts/users/infrastructure/persistence/typeorm/entities/user.entity';
import { PermissionEntity } from './src/contexts/users/infrastructure/persistence/typeorm/entities/permission.entity';
import { RoleEntity } from './src/contexts/users/infrastructure/persistence/typeorm/entities/role.entity';
import { BrandEntity } from './src/contexts/inventory/infrastructure/persistence/typeorm/entities/brand.entity';
import { CategoryEntity } from './src/contexts/inventory/infrastructure/persistence/typeorm/entities/category.entity';
import { ProductEntity } from './src/contexts/inventory/infrastructure/persistence/typeorm/entities/product.entity';
import { BundleEntity } from './src/contexts/inventory/infrastructure/persistence/typeorm/entities/bundle.entity';
import { SlabEntity } from './src/contexts/inventory/infrastructure/persistence/typeorm/entities/slab.entity';
import { LevelEntity } from './src/contexts/inventory/infrastructure/persistence/typeorm/entities/level.entity';
import { FinishEntity } from './src/contexts/inventory/infrastructure/persistence/typeorm/entities/finish.entity';
import { SupplierEntity } from './src/contexts/inventory/infrastructure/persistence/typeorm/entities/supplier.entity';
import { ProductSupplierEntity } from './src/contexts/inventory/infrastructure/persistence/typeorm/entities/product-supplier.entity';
import { PurchaseInvoiceItemEntity } from './src/contexts/purchasing/infrastructure/persistence/typeorm/entities/purchase-invoice-item.entity';
import { JobEntity } from './src/contexts/projects/infrastructure/persistence/typeorm/entities/job.entity';
import { JobItemEntity } from './src/contexts/projects/infrastructure/persistence/typeorm/entities/job-item.entity';
import { PurchaseInvoiceEntity } from './src/contexts/purchasing/infrastructure/persistence/typeorm/entities/purchase-invoice.entity';
import { SupplierReturnEntity } from './src/contexts/purchasing/infrastructure/persistence/typeorm/entities/supplier-return.entity';
import { SupplierReturnItemEntity } from './src/contexts/purchasing/infrastructure/persistence/typeorm/entities/supplier-return-item.entity';

dotenv.config();

const config: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    UserEntity,
    RoleEntity,
    PermissionEntity,
    BrandEntity,
    CategoryEntity,
    ProductEntity,
    BundleEntity,
    SlabEntity,
    LevelEntity,
    FinishEntity,
    SupplierEntity,
    ProductSupplierEntity,
    PurchaseInvoiceItemEntity,
    JobEntity,
    JobItemEntity,
    PurchaseInvoiceEntity,
    SupplierReturnEntity,
    SupplierReturnItemEntity,
  ],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'typeorm_migrations',
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
};
const AppDataSource = new DataSource(config);

export default AppDataSource;
