import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '@contexts/auth/infrastructure/decorators/public.decorator';
import { GetCatalogProductsQuery } from '@contexts/inventory/application/queries/get-catalog-products/get-catalog-products.query';
import { CatalogProductOutputDto } from '@contexts/inventory/application/dtos/catalog-product-output.dto';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

@ApiTags('Catalog')
@Controller('catalog/products')
export class GetCatalogProductsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get public product catalog (no auth required)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'levelId', required: false })
  @ApiQuery({ name: 'finishId', required: false })
  @ApiQuery({ name: 'brandId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({
    status: 200,
    description: 'Paginated catalog products.',
    type: CatalogProductOutputDto,
    isArray: true,
  })
  async run(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('categoryId') categoryId?: string,
    @Query('levelId') levelId?: string,
    @Query('finishId') finishId?: string,
    @Query('brandId') brandId?: string,
    @Query('search') search?: string,
  ): Promise<PaginatedResult<CatalogProductOutputDto>> {
    return this.queryBus.execute(
      new GetCatalogProductsQuery(
        {
          page: page ? parseInt(page, 10) : 1,
          limit: limit ? parseInt(limit, 10) : 20,
        },
        categoryId,
        levelId,
        finishId,
        brandId,
        search,
      ),
    );
  }
}
