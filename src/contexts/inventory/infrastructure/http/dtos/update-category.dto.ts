import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Category name' })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({ example: 'Category description' })
  @IsString()
  @IsOptional()
  readonly description?: string;
}
