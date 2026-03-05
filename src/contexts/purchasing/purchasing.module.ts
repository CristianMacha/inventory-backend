import { forwardRef, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedInfrastructureModule } from '@shared/infrastructure/shared-infrastructure.module';
import { InventoryModule } from '@contexts/inventory/inventory.module';
import { PURCHASING_TOKENS } from './application/purchasing.tokens';

import { PurchaseInvoiceEntity } from './infrastructure/persistence/typeorm/entities/purchase-invoice.entity';
import { PurchaseInvoiceItemEntity } from './infrastructure/persistence/typeorm/entities/purchase-invoice-item.entity';
import { SupplierReturnEntity } from './infrastructure/persistence/typeorm/entities/supplier-return.entity';
import { SupplierReturnItemEntity } from './infrastructure/persistence/typeorm/entities/supplier-return-item.entity';

import { TypeOrmPurchaseInvoiceRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-purchase-invoice.repository';
import { TypeOrmSupplierReturnRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-supplier-return.repository';

import { CreatePurchaseInvoiceHandler } from './application/commands/create-purchase-invoice/create-purchase-invoice.handler';
import { AddInvoiceItemHandler } from './application/commands/add-invoice-item/add-invoice-item.handler';
import { RemoveInvoiceItemHandler } from './application/commands/remove-invoice-item/remove-invoice-item.handler';
import { ReceiveInvoiceHandler } from './application/commands/receive-invoice/receive-invoice.handler';
import { PayInvoiceHandler } from './application/commands/pay-invoice/pay-invoice.handler';
import { CancelInvoiceHandler } from './application/commands/cancel-invoice/cancel-invoice.handler';

import { CreateSupplierReturnHandler } from './application/commands/create-supplier-return/create-supplier-return.handler';
import { AddReturnItemHandler } from './application/commands/add-return-item/add-return-item.handler';
import { RemoveReturnItemHandler } from './application/commands/remove-return-item/remove-return-item.handler';
import { SendSupplierReturnHandler } from './application/commands/send-supplier-return/send-supplier-return.handler';
import { CreditSupplierReturnHandler } from './application/commands/credit-supplier-return/credit-supplier-return.handler';
import { CancelSupplierReturnHandler } from './application/commands/cancel-supplier-return/cancel-supplier-return.handler';

import { GetPurchaseInvoicesHandler } from './application/queries/get-purchase-invoices/get-purchase-invoices.handler';
import { GetPurchaseInvoiceByIdHandler } from './application/queries/get-purchase-invoice-by-id/get-purchase-invoice-by-id.handler';
import { GetBundleCostSummaryHandler } from './application/queries/get-bundle-cost-summary/get-bundle-cost-summary.handler';
import { GetPurchaseInvoicesSelectHandler } from './application/queries/get-purchase-invoices-select/get-purchase-invoices-select.handler';
import { GetSupplierReturnsHandler } from './application/queries/get-supplier-returns/get-supplier-returns.handler';
import { GetSupplierReturnByIdHandler } from './application/queries/get-supplier-return-by-id/get-supplier-return-by-id.handler';
import { GetSupplierReturnsSelectHandler } from './application/queries/get-supplier-returns-select/get-supplier-returns-select.handler';
import { PurchaseInvoicesController } from './infrastructure/http/controllers/purchase-invoices.controller';
import { SupplierReturnsController } from './infrastructure/http/controllers/supplier-returns.controller';

const CommandHandlers = [
  CreatePurchaseInvoiceHandler,
  AddInvoiceItemHandler,
  RemoveInvoiceItemHandler,
  ReceiveInvoiceHandler,
  PayInvoiceHandler,
  CancelInvoiceHandler,
  CreateSupplierReturnHandler,
  AddReturnItemHandler,
  RemoveReturnItemHandler,
  SendSupplierReturnHandler,
  CreditSupplierReturnHandler,
  CancelSupplierReturnHandler,
];

const QueryHandlers = [
  GetPurchaseInvoicesHandler,
  GetPurchaseInvoiceByIdHandler,
  GetBundleCostSummaryHandler,
  GetPurchaseInvoicesSelectHandler,
  GetSupplierReturnsHandler,
  GetSupplierReturnByIdHandler,
  GetSupplierReturnsSelectHandler,
];

const PersistenceProviders: Provider[] = [
  {
    provide: PURCHASING_TOKENS.PURCHASE_INVOICE_REPOSITORY,
    useClass: TypeOrmPurchaseInvoiceRepository,
  },
  {
    provide: PURCHASING_TOKENS.SUPPLIER_RETURN_REPOSITORY,
    useClass: TypeOrmSupplierReturnRepository,
  },
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      PurchaseInvoiceEntity,
      PurchaseInvoiceItemEntity,
      SupplierReturnEntity,
      SupplierReturnItemEntity,
    ]),
    SharedInfrastructureModule,
    forwardRef(() => InventoryModule),
  ],
  controllers: [PurchaseInvoicesController, SupplierReturnsController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...PersistenceProviders,
  ],
  exports: [...PersistenceProviders],
})
export class PurchasingModule {}
