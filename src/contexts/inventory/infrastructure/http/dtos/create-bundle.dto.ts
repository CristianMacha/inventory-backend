import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateBundleDto {
  @ApiProperty({ example: 'Product UUID' })
  @IsUUID()
  @IsNotEmpty()
  readonly productId: string;

  @ApiProperty({ example: 'Supplier UUID' })
  @IsUUID()
  @IsNotEmpty()
  readonly supplierId: string;

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
