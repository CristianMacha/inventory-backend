import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateSlabDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Bundle UUID',
  })
  @IsUUID()
  @IsNotEmpty()
  bundleId: string;

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

  @ApiPropertyOptional({ example: 'Optional slab description' })
  @IsString()
  @IsOptional()
  description?: string;
}
