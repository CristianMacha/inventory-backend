import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateBundleDto {
  @ApiPropertyOptional({ example: 'LOT-2024-001' })
  @IsString()
  @IsOptional()
  readonly lotNumber?: string;

  @ApiPropertyOptional({
    example: 2.0,
    description: 'Thickness in centimeters',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly thicknessCm?: number;
}
