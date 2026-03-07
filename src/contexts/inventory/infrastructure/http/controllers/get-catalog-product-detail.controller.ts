import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Public } from '@contexts/auth/infrastructure/decorators/public.decorator';
import { GetCatalogProductDetailQuery } from '@contexts/inventory/application/queries/get-catalog-product-detail/get-catalog-product-detail.query';
import type { CatalogProductDetailOutputDto } from '@contexts/inventory/application/dtos/catalog-product-output.dto';

@ApiTags('Catalog')
@Controller('catalog/products')
export class GetCatalogProductDetailController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Get public product detail with available bundles (no auth required)',
  })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({
    status: 200,
    description: 'Product detail with bundles and available slabs.',
  })
  @ApiResponse({ status: 404, description: 'Product not found or not public.' })
  async run(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CatalogProductDetailOutputDto> {
    return this.queryBus.execute(new GetCatalogProductDetailQuery(id));
  }
}
