import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_LIMIT,
  normalizePaginationParams,
  type PaginationParams,
} from '@shared/domain/pagination/pagination-params.interface';
import { SlabStatus } from '../../../domain/enums/slab-status.enum';

export class GetSlabsQueryDto {
  @ApiPropertyOptional({ description: 'Filter by bundle UUID' })
  @IsOptional()
  @IsUUID()
  bundleId?: string;

  @ApiPropertyOptional({ enum: SlabStatus, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(SlabStatus)
  status?: SlabStatus;

  @ApiPropertyOptional({ description: 'Search by slab code' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({ description: 'Filter only remnants (true) or only originals (false)' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === true || value === 'true') return true;
    if (value === false || value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isRemnant?: boolean;

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

export function toPaginationParams(dto: GetSlabsQueryDto): PaginationParams {
  return normalizePaginationParams(dto.page, dto.limit);
}
