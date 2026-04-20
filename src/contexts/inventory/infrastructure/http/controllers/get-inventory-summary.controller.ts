import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { GetInventorySummaryQuery } from '@contexts/inventory/application/queries/get-inventory-summary/get-inventory-summary.query';
import { InventorySummaryOutputDto } from '@contexts/inventory/application/dtos/inventory-summary-output.dto';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';

@ApiBearerAuth()
@ApiTags('Inventory')
@Controller('inventory')
export class GetInventorySummaryController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('summary')
  @RequirePermissions(Permissions.SLABS.LIST)
  @ApiOperation({
    summary:
      'Get inventory stock summary by product (slabs count and area in m²)',
  })
  @ApiQuery({
    name: 'productId',
    required: false,
    type: String,
    description: 'Filter summary to a single product',
  })
  @ApiResponse({
    status: 200,
    description:
      'Inventory summary with slab counts and available area per product',
    type: InventorySummaryOutputDto,
  })
  async run(
    @Query('productId') productId?: string,
  ): Promise<InventorySummaryOutputDto> {
    return this.queryBus.execute(new GetInventorySummaryQuery(productId));
  }
}
