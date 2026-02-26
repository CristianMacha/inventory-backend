import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { GetDashboardSummaryQuery } from '../../../application/queries/get-dashboard-summary/get-dashboard-summary.query';
import { DashboardSummaryDto } from '../../../application/dtos/dashboard-summary.dto';
import { JwtAuthGuard } from '@contexts/auth/infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@contexts/auth/infrastructure/guards/permissions.guard';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';

@ApiBearerAuth()
@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class GetDashboardSummaryController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('summary')
  @RequirePermissions(Permissions.DASHBOARD.VIEW)
  @ApiOperation({ summary: 'Get dashboard summary metrics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard summary retrieved successfully',
    type: DashboardSummaryDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async run(): Promise<DashboardSummaryDto> {
    return this.queryBus.execute(new GetDashboardSummaryQuery());
  }
}
