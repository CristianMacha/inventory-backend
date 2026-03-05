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
import { PaymentMethod } from '../../../domain/enums/payment-method.enum';

export class GetJobPaymentsQueryDto {
  @ApiPropertyOptional({ enum: PaymentMethod, description: 'Filter by payment method' })
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
