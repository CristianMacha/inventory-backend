import { ApiProperty } from '@nestjs/swagger';

export class ProductBrandDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'Marca XYZ' })
  name: string;
}

export class ProductCategoryDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'Granito' })
  name: string;
}

export class IProductOutputDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'Granito Blanco Polar' })
  name: string;

  @ApiProperty({ example: 'Descripción del producto', required: false })
  description?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ type: () => ProductBrandDto, required: false })
  brand?: ProductBrandDto;

  @ApiProperty({ type: () => ProductCategoryDto, required: false })
  category?: ProductCategoryDto;

  @ApiProperty({ example: 'uuid-level' })
  levelId: string;

  @ApiProperty({ example: 'uuid-finish' })
  finishId: string;

  @ApiProperty({ example: 'uuid-user' })
  createdBy: string;

  @ApiProperty({ example: 'uuid-user' })
  updatedBy: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: string;
}
