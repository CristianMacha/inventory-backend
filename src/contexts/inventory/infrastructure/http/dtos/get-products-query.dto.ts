import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsArray,
  IsUUID,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  normalizePaginationParams,
  type PaginationParams,
} from '@shared/domain/pagination/pagination-params.interface';
import type { ProductSearchFilters } from '@contexts/inventory/domain/repositories/product-search-filters.interface';

export class GetProductsQueryDto {
  @ApiPropertyOptional({
    description: 'Search term for name and description',
    example: 'mesa',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by brand UUID(s), deprecated — use brandIds instead',
    example: '123e4567-e89b-12d3-a456-426614174000',
    deprecated: true,
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    return (Array.isArray(value) ? value : [value]) as string[];
  })
  @IsArray()
  @IsUUID('4', { each: true })
  brandId?: string[];

  @ApiPropertyOptional({
    description: 'Filter by one or more brand UUIDs',
    example: '123e4567-e89b-12d3-a456-426614174000',
    isArray: true,
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    return (Array.isArray(value) ? value : [value]) as string[];
  })
  @IsArray()
  @IsUUID('4', { each: true })
  brandIds?: string[];

  @ApiPropertyOptional({
    description:
      'Filter by category UUID(s), deprecated — use categoryIds instead',
    example: '123e4567-e89b-12d3-a456-426614174000',
    deprecated: true,
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    return (Array.isArray(value) ? value : [value]) as string[];
  })
  @IsArray()
  @IsUUID('4', { each: true })
  categoryId?: string[];

  @ApiPropertyOptional({
    description: 'Filter by one or more category UUIDs',
    example: '123e4567-e89b-12d3-a456-426614174000',
    isArray: true,
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    return (Array.isArray(value) ? value : [value]) as string[];
  })
  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds?: string[];

  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    default: DEFAULT_PAGE,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = DEFAULT_PAGE;

  @ApiPropertyOptional({
    description: 'Items per page',
    default: DEFAULT_LIMIT,
    minimum: 1,
    maximum: MAX_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_LIMIT)
  limit?: number = DEFAULT_LIMIT;
}

export function toFilters(dto: GetProductsQueryDto): ProductSearchFilters {
  const brandIds = [...(dto.brandIds ?? []), ...(dto.brandId ?? [])];
  const categoryIds = [...(dto.categoryIds ?? []), ...(dto.categoryId ?? [])];
  return {
    search: dto.search?.trim() || undefined,
    brandIds: brandIds.length ? brandIds : undefined,
    categoryIds: categoryIds.length ? categoryIds : undefined,
  };
}

export function toPaginationParams(dto: GetProductsQueryDto): PaginationParams {
  return normalizePaginationParams(dto.page, dto.limit);
}
