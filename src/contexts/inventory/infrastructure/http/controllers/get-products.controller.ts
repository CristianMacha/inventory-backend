import { Controller, UseGuards, Get, Query, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '@contexts/auth/infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@contexts/auth/infrastructure/guards/permissions.guard';
import { GetProductsQuery } from '@contexts/inventory/application/queries/get-products/get-products.query';
import { GetProductByIdQuery } from '@contexts/inventory/application/queries/get-product-by-id/get-product-by-id.query';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { Permissions } from '@shared/authorization/permissions';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';
import { IProductOutputDto } from '@contexts/inventory/application/dtos/product-output.dto';
import {
  GetProductsQueryDto,
  toFilters,
  toPaginationParams,
} from '../dtos/get-products-query.dto';

@ApiBearerAuth()
@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class GetProductsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @RequirePermissions(Permissions.PRODUCTS.READ)
  @ApiOperation({
    summary: 'Get products with search and pagination',
    description:
      'Returns a paginated list of products. Optional filters: search (name/description), brandIds (one or more), categoryIds (one or more).',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search in name and description',
  })
  @ApiQuery({
    name: 'brandIds',
    required: false,
    isArray: true,
    description: 'Filter by one or more brand UUIDs',
  })
  @ApiQuery({
    name: 'categoryIds',
    required: false,
    isArray: true,
    description: 'Filter by one or more category UUIDs',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page (1-based)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated products (data, total, page, limit, totalPages).',
    type: IProductOutputDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. User lacks required permissions.',
  })
  async run(
    @Query() query: GetProductsQueryDto,
  ): Promise<PaginatedResult<IProductOutputDto>> {
    const filters = toFilters(query);
    const pagination = toPaginationParams(query);
    return await this.queryBus.execute(
      new GetProductsQuery(filters, pagination),
    );
  }

  @Get(':id')
  @RequirePermissions(Permissions.PRODUCTS.READ)
  @ApiOperation({
    summary: 'Get product by ID',
    description:
      'Returns a single product by ID including brand and category information.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Product with brand and category.',
    type: IProductOutputDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. User lacks required permissions.',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
  })
  async getById(@Param('id') id: string): Promise<IProductOutputDto> {
    return await this.queryBus.execute(new GetProductByIdQuery(id));
  }
}
