import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateWorkshopSupplierDto {
  @ApiPropertyOptional()
  @IsString()
  @MinLength(1)
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly phone?: string | null;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  readonly email?: string | null;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly address?: string | null;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly notes?: string | null;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  readonly isActive?: boolean;
}
