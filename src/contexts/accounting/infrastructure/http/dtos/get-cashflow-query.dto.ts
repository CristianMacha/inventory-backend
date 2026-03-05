import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsOptional } from 'class-validator';

export class GetCashflowQueryDto {
  @ApiProperty({ example: '2026-01-01', required: false })
  @IsOptional()
  @IsISO8601({ strict: true })
  fromDate?: string;

  @ApiProperty({ example: '2026-03-31', required: false })
  @IsOptional()
  @IsISO8601({ strict: true })
  toDate?: string;
}
