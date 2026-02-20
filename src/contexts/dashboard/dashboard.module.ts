import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { InventoryModule } from '@contexts/inventory/inventory.module';
import { GetDashboardSummaryHandler } from './application/queries/get-dashboard-summary/get-dashboard-summary.handler';
import { GetDashboardSummaryController } from './infrastructure/http/controllers/get-dashboard-summary.controller';

@Module({
  imports: [CqrsModule, InventoryModule],
  controllers: [GetDashboardSummaryController],
  providers: [GetDashboardSummaryHandler],
})
export class DashboardModule {}
