import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateLevelDto {
  @ApiPropertyOptional({ example: 'Premium' })
  @IsString()
  @MinLength(1)
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({ example: 1, description: 'Display sort order' })
  @IsInt()
  @Min(0)
  @IsOptional()
  readonly sortOrder?: number;

  @ApiPropertyOptional({ example: 'Nivel premium de calidad' })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  readonly isActive?: boolean;
}
