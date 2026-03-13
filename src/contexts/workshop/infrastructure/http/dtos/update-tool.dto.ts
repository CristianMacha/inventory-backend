import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';
import { ToolStatus } from '../../../domain/enums/tool-status.enum';

export class UpdateToolDto {
  @ApiPropertyOptional()
  @IsString()
  @MinLength(1)
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly description?: string | null;

  @ApiPropertyOptional({ enum: ToolStatus })
  @IsEnum(ToolStatus)
  @IsOptional()
  readonly status?: ToolStatus;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  readonly categoryId?: string | null;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  readonly supplierId?: string | null;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly purchasePrice?: number | null;
}
