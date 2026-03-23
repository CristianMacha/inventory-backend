import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '@contexts/auth/infrastructure/decorators/public.decorator';
import { GetCatalogFiltersQuery } from '@contexts/inventory/application/queries/get-catalog-filters/get-catalog-filters.query';
import { CatalogFiltersOutputDto } from '@contexts/inventory/application/dtos/catalog-filters-output.dto';

@ApiTags('Catalog')
@Controller('catalog/filters')
export class GetCatalogFiltersController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get all filter options for the catalog (no auth required)',
  })
  @ApiResponse({
    status: 200,
    description: 'Categories, brands, levels and finishes.',
    type: CatalogFiltersOutputDto,
  })
  async run(): Promise<CatalogFiltersOutputDto> {
    return this.queryBus.execute(new GetCatalogFiltersQuery());
  }
}
