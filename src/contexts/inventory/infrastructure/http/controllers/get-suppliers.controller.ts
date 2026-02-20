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
import { GetSuppliersQuery } from '../../../application/queries/get-suppliers/get-suppliers.query';
import { GetActiveSuppliersQuery } from '../../../application/queries/get-active-suppliers/get-active-suppliers.query';
import { ISupplierOutputDto } from '../../../application/dtos/supplier-output.dto';

@ApiBearerAuth()
@ApiTags('Suppliers')
@Controller('suppliers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class GetSuppliersController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @RequirePermissions(Permissions.SUPPLIERS.LIST)
  @ApiOperation({ summary: 'Get all suppliers' })
  @ApiResponse({
    status: 200,
    description: 'Suppliers retrieved successfully',
    type: ISupplierOutputDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async run(): Promise<ISupplierOutputDto[]> {
    return this.queryBus.execute(new GetSuppliersQuery());
  }

  @Get('active')
  @RequirePermissions(Permissions.SUPPLIERS.LIST)
  @ApiOperation({ summary: 'Get active suppliers for select dropdowns' })
  @ApiResponse({
    status: 200,
    description: 'Active suppliers',
    type: ISupplierOutputDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getActive(): Promise<ISupplierOutputDto[]> {
    return this.queryBus.execute(new GetActiveSuppliersQuery());
  }
}
