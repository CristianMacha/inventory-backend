import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateMaterialDto {
  @ApiProperty({ example: 'Cemento Portland' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 'kg' })
  @IsString()
  @IsNotEmpty()
  readonly unit: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly minStock?: number;

  @ApiPropertyOptional({ example: 12.5 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly unitPrice?: number;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  readonly categoryId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  readonly supplierId?: string;
}
