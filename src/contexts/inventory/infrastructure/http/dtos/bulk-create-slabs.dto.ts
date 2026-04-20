import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SlabItemDto {
  @ApiProperty({
    example: 'SN-2024-001',
    description: 'Unique code for the slab',
  })
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

  @ApiPropertyOptional({ example: 'No visible defects' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class BulkCreateSlabsDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Bundle UUID to add slabs to',
  })
  @IsUUID()
  @IsNotEmpty()
  bundleId: string;

  @ApiProperty({ type: [SlabItemDto], minItems: 1 })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SlabItemDto)
  slabs: SlabItemDto[];
}
