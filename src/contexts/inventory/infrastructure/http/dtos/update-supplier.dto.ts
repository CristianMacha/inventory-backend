import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateSupplierDto {
  @ApiPropertyOptional({ example: 'Proveedor ABC' })
  @IsString()
  @MinLength(1)
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({ example: 'ABC' })
  @IsString()
  @IsOptional()
  readonly abbreviation?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  readonly isActive?: boolean;
}
