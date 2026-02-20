import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBrandDto {
  @ApiPropertyOptional({ example: 'Brand name' })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({ example: 'Brand description' })
  @IsString()
  @IsOptional()
  readonly description?: string;
}
