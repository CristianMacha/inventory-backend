import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WORKSHOP_TOKENS } from './workshop.tokens';

// TypeORM Entities
import { ToolTypeormEntity } from './infrastructure/persistence/typeorm/entities/tool.typeorm.entity';
import { MaterialTypeormEntity } from './infrastructure/persistence/typeorm/entities/material.typeorm.entity';
import { WorkshopCategoryTypeormEntity } from './infrastructure/persistence/typeorm/entities/workshop-category.typeorm.entity';
import { WorkshopSupplierTypeormEntity } from './infrastructure/persistence/typeorm/entities/workshop-supplier.typeorm.entity';
import { MaterialMovementTypeormEntity } from './infrastructure/persistence/typeorm/entities/material-movement.typeorm.entity';
import { ToolMovementTypeormEntity } from './infrastructure/persistence/typeorm/entities/tool-movement.typeorm.entity';

// Repositories
import { TypeOrmToolRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-tool.repository';
import { TypeOrmMaterialRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-material.repository';
import { TypeOrmWorkshopCategoryRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-workshop-category.repository';
import { TypeOrmWorkshopSupplierRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-workshop-supplier.repository';
import { TypeOrmMaterialMovementRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-material-movement.repository';
import { TypeOrmToolMovementRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-tool-movement.repository';

// Command Handlers
import { CreateToolHandler } from './application/commands/create-tool/create-tool.handler';
import { UpdateToolHandler } from './application/commands/update-tool/update-tool.handler';
import { DeleteToolHandler } from './application/commands/delete-tool/delete-tool.handler';
import { CreateMaterialHandler } from './application/commands/create-material/create-material.handler';
import { UpdateMaterialHandler } from './application/commands/update-material/update-material.handler';
import { DeleteMaterialHandler } from './application/commands/delete-material/delete-material.handler';
import { CreateWorkshopCategoryHandler } from './application/commands/create-workshop-category/create-workshop-category.handler';
import { UpdateWorkshopCategoryHandler } from './application/commands/update-workshop-category/update-workshop-category.handler';
import { CreateWorkshopSupplierHandler } from './application/commands/create-workshop-supplier/create-workshop-supplier.handler';
import { UpdateWorkshopSupplierHandler } from './application/commands/update-workshop-supplier/update-workshop-supplier.handler';
import { UploadToolImageHandler } from './application/commands/upload-tool-image/upload-tool-image.handler';
import { DeleteToolImageHandler } from './application/commands/delete-tool-image/delete-tool-image.handler';
import { UploadMaterialImageHandler } from './application/commands/upload-material-image/upload-material-image.handler';
import { DeleteMaterialImageHandler } from './application/commands/delete-material-image/delete-material-image.handler';
import { RegisterMaterialMovementHandler } from './application/commands/register-material-movement/register-material-movement.handler';
import { ChangeToolStatusHandler } from './application/commands/change-tool-status/change-tool-status.handler';

// Query Handlers
import { GetToolsHandler } from './application/queries/get-tools/get-tools.handler';
import { GetToolByIdHandler } from './application/queries/get-tool-by-id/get-tool-by-id.handler';
import { GetMaterialsHandler } from './application/queries/get-materials/get-materials.handler';
import { GetMaterialByIdHandler } from './application/queries/get-material-by-id/get-material-by-id.handler';
import { GetWorkshopCategoriesHandler } from './application/queries/get-workshop-categories/get-workshop-categories.handler';
import { GetWorkshopSuppliersHandler } from './application/queries/get-workshop-suppliers/get-workshop-suppliers.handler';
import { GetMaterialMovementsHandler } from './application/queries/get-material-movements/get-material-movements.handler';
import { GetMaterialStockHandler } from './application/queries/get-material-stock/get-material-stock.handler';
import { GetToolMovementsHandler } from './application/queries/get-tool-movements/get-tool-movements.handler';

// Controllers
import { ToolsController } from './infrastructure/http/controllers/tools.controller';
import { MaterialsController } from './infrastructure/http/controllers/materials.controller';
import { WorkshopCategoriesController } from './infrastructure/http/controllers/workshop-categories.controller';
import { WorkshopSuppliersController } from './infrastructure/http/controllers/workshop-suppliers.controller';

const CommandHandlers = [
  CreateToolHandler,
  UpdateToolHandler,
  DeleteToolHandler,
  CreateMaterialHandler,
  UpdateMaterialHandler,
  DeleteMaterialHandler,
  CreateWorkshopCategoryHandler,
  UpdateWorkshopCategoryHandler,
  CreateWorkshopSupplierHandler,
  UpdateWorkshopSupplierHandler,
  UploadToolImageHandler,
  DeleteToolImageHandler,
  UploadMaterialImageHandler,
  DeleteMaterialImageHandler,
  RegisterMaterialMovementHandler,
  ChangeToolStatusHandler,
];

const QueryHandlers = [
  GetToolsHandler,
  GetToolByIdHandler,
  GetMaterialsHandler,
  GetMaterialByIdHandler,
  GetWorkshopCategoriesHandler,
  GetWorkshopSuppliersHandler,
  GetMaterialMovementsHandler,
  GetMaterialStockHandler,
  GetToolMovementsHandler,
];

const PersistenceProviders: Provider[] = [
  { provide: WORKSHOP_TOKENS.TOOL_REPOSITORY, useClass: TypeOrmToolRepository },
  {
    provide: WORKSHOP_TOKENS.MATERIAL_REPOSITORY,
    useClass: TypeOrmMaterialRepository,
  },
  {
    provide: WORKSHOP_TOKENS.CATEGORY_REPOSITORY,
    useClass: TypeOrmWorkshopCategoryRepository,
  },
  {
    provide: WORKSHOP_TOKENS.SUPPLIER_REPOSITORY,
    useClass: TypeOrmWorkshopSupplierRepository,
  },
  {
    provide: WORKSHOP_TOKENS.MATERIAL_MOVEMENT_REPOSITORY,
    useClass: TypeOrmMaterialMovementRepository,
  },
  {
    provide: WORKSHOP_TOKENS.TOOL_MOVEMENT_REPOSITORY,
    useClass: TypeOrmToolMovementRepository,
  },
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      ToolTypeormEntity,
      MaterialTypeormEntity,
      WorkshopCategoryTypeormEntity,
      WorkshopSupplierTypeormEntity,
      MaterialMovementTypeormEntity,
      ToolMovementTypeormEntity,
    ]),
  ],
  controllers: [
    ToolsController,
    MaterialsController,
    WorkshopCategoriesController,
    WorkshopSuppliersController,
  ],
  providers: [...CommandHandlers, ...QueryHandlers, ...PersistenceProviders],
  exports: [...PersistenceProviders],
})
export class WorkshopModule {}
