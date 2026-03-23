import { ApiProperty } from '@nestjs/swagger';

export class CatalogFilterItemDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'Marble' })
  name: string;
}

export class CatalogFiltersOutputDto {
  @ApiProperty({ type: () => [CatalogFilterItemDto] })
  categories: CatalogFilterItemDto[];

  @ApiProperty({ type: () => [CatalogFilterItemDto] })
  brands: CatalogFilterItemDto[];

  @ApiProperty({ type: () => [CatalogFilterItemDto] })
  levels: CatalogFilterItemDto[];

  @ApiProperty({ type: () => [CatalogFilterItemDto] })
  finishes: CatalogFilterItemDto[];
}
