import { IsEnum, IsInt, IsISO8601, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_LIMIT,
  normalizePaginationParams,
  type PaginationParams,
} from '@shared/domain/pagination/pagination-params.interface';
import { PaymentType } from '../../../domain/enums/payment-type.enum';
import { PaymentCategory } from '../../../domain/enums/payment-category.enum';
import { PaymentMethod } from '../../../domain/enums/payment-method.enum';

export class GetGeneralPaymentsQueryDto {
  @ApiPropertyOptional({ enum: PaymentType })
  @IsOptional()
  @IsEnum(PaymentType)
  type?: PaymentType;

  @ApiPropertyOptional({ enum: PaymentCategory })
  @IsOptional()
  @IsEnum(PaymentCategory)
  category?: PaymentCategory;

  @ApiPropertyOptional({ enum: PaymentMethod })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional({ description: 'Filter payments from this date (YYYY-MM-DD)' })
  @IsOptional()
  @IsISO8601({ strict: false })
  fromDate?: string;

  @ApiPropertyOptional({ description: 'Filter payments up to this date (YYYY-MM-DD)' })
  @IsOptional()
  @IsISO8601({ strict: false })
  toDate?: string;

  @ApiPropertyOptional({ default: DEFAULT_PAGE, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = DEFAULT_PAGE;

  @ApiPropertyOptional({ default: DEFAULT_LIMIT, minimum: 1, maximum: MAX_LIMIT })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_LIMIT)
  limit?: number = DEFAULT_LIMIT;

  toPaginationParams(): PaginationParams {
    return normalizePaginationParams(this.page, this.limit);
  }
}
