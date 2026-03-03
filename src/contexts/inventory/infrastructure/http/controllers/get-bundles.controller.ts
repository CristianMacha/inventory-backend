import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { GetBundlesQuery } from '../../../application/queries/get-bundles/get-bundles.query';
import { IBundleOutputDto } from '../../../application/dtos/bundle-output.dto';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import {
  GetBundlesQueryDto,
  toPaginationParams,
} from '../dtos/get-bundles-query.dto';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

@ApiBearerAuth()
@ApiTags('Bundles')
@Controller('bundles')
export class GetBundlesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @RequirePermissions(Permissions.BUNDLES.LIST)
  @ApiOperation({ summary: 'Get bundles with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Paginated bundles',
    type: IBundleOutputDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async run(
    @Query() query: GetBundlesQueryDto,
  ): Promise<PaginatedResult<IBundleOutputDto>> {
    return this.queryBus.execute(
      new GetBundlesQuery(toPaginationParams(query), query.productId),
    );
  }
}
