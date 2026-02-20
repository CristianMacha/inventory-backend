import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@contexts/auth/infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@contexts/auth/infrastructure/guards/permissions.guard';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { GetFinishesQuery } from '../../../application/queries/get-finishes/get-finishes.query';
import { GetActiveFinishesQuery } from '../../../application/queries/get-active-finishes/get-active-finishes.query';
import { IFinishOutputDto } from '../../../application/dtos/finish-output.dto';

@ApiBearerAuth()
@ApiTags('Finishes')
@Controller('finishes')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class GetFinishesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @RequirePermissions(Permissions.FINISHES.LIST)
  @ApiOperation({ summary: 'Get all finishes' })
  @ApiResponse({
    status: 200,
    description: 'Finishes retrieved successfully',
    type: IFinishOutputDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async run(): Promise<IFinishOutputDto[]> {
    return this.queryBus.execute(new GetFinishesQuery());
  }

  @Get('active')
  @RequirePermissions(Permissions.FINISHES.LIST)
  @ApiOperation({ summary: 'Get active finishes for select dropdowns' })
  @ApiResponse({
    status: 200,
    description: 'Active finishes',
    type: IFinishOutputDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getActive(): Promise<IFinishOutputDto[]> {
    return this.queryBus.execute(new GetActiveFinishesQuery());
  }
}
