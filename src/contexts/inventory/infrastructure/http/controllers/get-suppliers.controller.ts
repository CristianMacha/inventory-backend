import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { GetSuppliersQuery } from '../../../application/queries/get-suppliers/get-suppliers.query';
import { GetActiveSuppliersQuery } from '../../../application/queries/get-active-suppliers/get-active-suppliers.query';
import { GetSupplierByIdQuery } from '../../../application/queries/get-supplier-by-id/get-supplier-by-id.query';
import { ISupplierOutputDto } from '../../../application/dtos/supplier-output.dto';

@ApiBearerAuth()
@ApiTags('Suppliers')
@Controller('suppliers')
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

  @Get(':id')
  @RequirePermissions(Permissions.SUPPLIERS.LIST)
  @ApiOperation({ summary: 'Get supplier by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Supplier UUID' })
  @ApiResponse({ status: 200, type: ISupplierOutputDto })
  @ApiResponse({ status: 404, description: 'Supplier not found' })
  async getById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ISupplierOutputDto> {
    return this.queryBus.execute(new GetSupplierByIdQuery(id));
  }
}
