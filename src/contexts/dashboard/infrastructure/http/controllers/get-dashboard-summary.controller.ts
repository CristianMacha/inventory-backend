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

@ApiBearerAuth()
@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class GetDashboardSummaryController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get dashboard summary with inventory metrics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard summary retrieved successfully',
    type: DashboardSummaryDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  async run(): Promise<DashboardSummaryDto> {
    return this.queryBus.execute(new GetDashboardSummaryQuery());
  }
}
