import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CatalogSlabOutputDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'SL-001' })
  code: string;

  @ApiProperty({ example: 120.5 })
  widthCm: number;

  @ApiProperty({ example: 240.0 })
  heightCm: number;

  @ApiProperty({ example: 'available' })
  status: string;
}

export class CatalogBundleOutputDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'LOT-2024-001' })
  lotNumber: string;

  @ApiProperty({ example: 2.0 })
  thicknessCm: number;

  @ApiPropertyOptional({ example: 'folder/image-public-id', nullable: true })
  imagePublicId: string | null;

  @ApiProperty({ type: () => [CatalogSlabOutputDto] })
  slabs: CatalogSlabOutputDto[];
}

export class CatalogProductRelationDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'Marble' })
  name: string;
}

export class CatalogProductOutputDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'Calacatta Gold' })
  name: string;

  @ApiProperty({ example: 'calacatta-gold' })
  slug: string;

  @ApiProperty({ example: 'A premium white marble with gold veining.' })
  description: string;

  @ApiPropertyOptional({ example: 'products/abc123', nullable: true })
  primaryImagePublicId: string | null;

  @ApiProperty({ type: () => CatalogProductRelationDto })
  category: CatalogProductRelationDto;

  @ApiProperty({ type: () => CatalogProductRelationDto })
  level: CatalogProductRelationDto;

  @ApiProperty({ type: () => CatalogProductRelationDto })
  finish: CatalogProductRelationDto;

  @ApiPropertyOptional({ type: () => CatalogProductRelationDto })
  brand?: CatalogProductRelationDto;
}

export class CatalogProductImageOutputDto {
  @ApiProperty({ example: 'products/abc123' })
  publicId: string;

  @ApiProperty({ example: true })
  isPrimary: boolean;

  @ApiProperty({ example: 0 })
  sortOrder: number;
}

export class CatalogProductDetailOutputDto extends CatalogProductOutputDto {
  @ApiProperty({ type: () => [CatalogProductImageOutputDto] })
  images: CatalogProductImageOutputDto[];

  @ApiProperty({ type: () => [CatalogBundleOutputDto] })
  bundles: CatalogBundleOutputDto[];
}
