import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateSlabInBundleDto {
  @ApiProperty({ example: 'SLB-001', description: 'Unique code for the slab' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 120.5, description: 'Width in centimeters' })
  @IsNumber()
  @Min(0.01)
  widthCm: number;

  @ApiProperty({ example: 240.0, description: 'Height in centimeters' })
  @IsNumber()
  @Min(0.01)
  heightCm: number;

  @ApiPropertyOptional({ example: 'Losa sin defectos' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateBundleWithSlabsDto {
  @ApiProperty({ example: 'uuid-product' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 'uuid-supplier' })
  @IsUUID()
  @IsNotEmpty()
  supplierId: string;

  @ApiPropertyOptional({ example: 'LOT-2024-001' })
  @IsString()
  @IsOptional()
  lotNumber?: string;

  @ApiPropertyOptional({
    example: 2.0,
    description: 'Thickness in centimeters',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  thicknessCm?: number;

  @ApiProperty({ type: [CreateSlabInBundleDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSlabInBundleDto)
  slabs: CreateSlabInBundleDto[];
}
