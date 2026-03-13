import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateMaterialDto {
  @ApiPropertyOptional()
  @IsString()
  @MinLength(1)
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly description?: string | null;

  @ApiPropertyOptional()
  @IsString()
  @MinLength(1)
  @IsOptional()
  readonly unit?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly minStock?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly unitPrice?: number | null;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  readonly categoryId?: string | null;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  readonly supplierId?: string | null;
}
