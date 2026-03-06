import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_LIMIT,
  normalizePaginationParams,
  type PaginationParams,
} from '@shared/domain/pagination/pagination-params.interface';

export class GetUsersQueryDto {
  @ApiPropertyOptional({ description: 'Search by name or email' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by role UUID' })
  @IsOptional()
  @IsUUID()
  roleId?: string;

  @ApiPropertyOptional({ default: DEFAULT_PAGE, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = DEFAULT_PAGE;

  @ApiPropertyOptional({
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

export function toPaginationParams(dto: GetUsersQueryDto): PaginationParams {
  return normalizePaginationParams(dto.page, dto.limit);
}
