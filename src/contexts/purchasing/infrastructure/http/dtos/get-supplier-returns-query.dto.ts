import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { SupplierReturnStatus } from '../../../domain/enums/supplier-return-status.enum';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

export class GetSupplierReturnsQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  supplierId?: string;

  @ApiPropertyOptional({ enum: SupplierReturnStatus })
  @IsOptional()
  @IsEnum(SupplierReturnStatus)
  status?: SupplierReturnStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  purchaseInvoiceId?: string;
}

export function toPaginationParams(
  dto: GetSupplierReturnsQueryDto,
): PaginationParams {
  return { page: dto.page ?? 1, limit: dto.limit ?? 20 };
}
