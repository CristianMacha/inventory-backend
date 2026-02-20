import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { GetSlabsQuery } from '../../../application/queries/get-slabs/get-slabs.query';
import { ISlabOutputDto } from '../../../application/dtos/slab-output.dto';
import { JwtAuthGuard } from '@contexts/auth/infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@contexts/auth/infrastructure/guards/permissions.guard';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import {
  GetSlabsQueryDto,
  toPaginationParams,
} from '../dtos/get-slabs-query.dto';
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
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async run(
    @Query() query: GetSlabsQueryDto,
  ): Promise<PaginatedResult<ISlabOutputDto>> {
    return this.queryBus.execute(
      new GetSlabsQuery(toPaginationParams(query), query.bundleId),
    );
  }
}
