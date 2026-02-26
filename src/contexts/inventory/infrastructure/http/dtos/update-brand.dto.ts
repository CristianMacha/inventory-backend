import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateBrandDto {
  @ApiPropertyOptional({ example: 'Brand name' })
  @IsString()
  @MinLength(1)
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({ example: 'Brand description' })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  readonly isActive?: boolean;
}
