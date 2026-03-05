import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';

import { GetCashflowSummaryQuery } from '../../../application/queries/get-cashflow-summary/get-cashflow-summary.query';
import { CashflowSummaryDto } from '../../../application/dtos/cashflow-summary.dto';
import { GetCashflowQueryDto } from '../dtos/get-cashflow-query.dto';

@ApiBearerAuth()
@ApiTags('Accounting')
@Controller('accounting')
export class CashflowController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('cashflow')
  @RequirePermissions(Permissions.ACCOUNTING.VIEW)
  @ApiOperation({ summary: 'Get cashflow summary (ingress vs egress)' })
  @ApiResponse({ status: 200, type: CashflowSummaryDto })
  async getCashflow(
    @Query() query: GetCashflowQueryDto,
  ): Promise<CashflowSummaryDto> {
    return this.queryBus.execute(
      new GetCashflowSummaryQuery(
        query.fromDate ? new Date(query.fromDate) : undefined,
        query.toDate ? new Date(query.toDate) : undefined,
      ),
    );
  }
}
