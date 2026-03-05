import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { InventoryModule } from '@contexts/inventory/inventory.module';
import { ProjectsModule } from '@contexts/projects/projects.module';
import { PurchasingModule } from '@contexts/purchasing/purchasing.module';
import { AccountingModule } from '@contexts/accounting/accounting.module';
import { GetDashboardSummaryHandler } from './application/queries/get-dashboard-summary/get-dashboard-summary.handler';
import { GetDashboardSummaryController } from './infrastructure/http/controllers/get-dashboard-summary.controller';

@Module({
  imports: [
    CqrsModule,
    InventoryModule,
    ProjectsModule,
    PurchasingModule,
    AccountingModule,
  ],
  controllers: [GetDashboardSummaryController],
  providers: [GetDashboardSummaryHandler],
})
export class DashboardModule {}
