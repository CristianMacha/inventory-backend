import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { GetSlabsQuery } from '../../../application/queries/get-slabs/get-slabs.query';
import { GetReturnableSlabsQuery } from '../../../application/queries/get-returnable-slabs/get-returnable-slabs.query';
import { ISlabOutputDto } from '../../../application/dtos/slab-output.dto';
import { SlabReturnableOutputDto } from '../../../application/dtos/slab-returnable-output.dto';
import { JwtAuthGuard } from '@contexts/auth/infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@contexts/auth/infrastructure/guards/permissions.guard';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import {
  GetSlabsQueryDto,
  toPaginationParams,
} from '../dtos/get-slabs-query.dto';
import { GetReturnableSlabsQueryDto } from '../dtos/get-returnable-slabs-query.dto';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

@ApiBearerAuth()
@ApiTags('Slabs')
@Controller('slabs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class GetSlabsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @RequirePermissions(Permissions.SLABS.LIST)
  @ApiOperation({
    summary: 'Get slabs with pagination and optional filter by bundle',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated slabs',
    type: ISlabOutputDto,
    isArray: true,
  })
  async run(
    @Query() query: GetSlabsQueryDto,
  ): Promise<PaginatedResult<ISlabOutputDto>> {
    return this.queryBus.execute(
      new GetSlabsQuery(toPaginationParams(query), query.bundleId),
    );
  }

  @Get('returnable')
  @RequirePermissions(Permissions.SLABS.LIST)
  @ApiOperation({
    summary: 'List slabs eligible for a supplier return (AVAILABLE or RESERVED) filtered by purchase invoice',
  })
  @ApiResponse({
    status: 200,
    type: SlabReturnableOutputDto,
    isArray: true,
  })
  async getReturnable(
    @Query() query: GetReturnableSlabsQueryDto,
  ): Promise<SlabReturnableOutputDto[]> {
    return this.queryBus.execute(
      new GetReturnableSlabsQuery(query.purchaseInvoiceId, query.bundleId),
    );
  }
}
