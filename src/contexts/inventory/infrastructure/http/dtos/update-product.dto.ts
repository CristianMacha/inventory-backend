import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Calacatta Gold' })
  @IsString()
  @MinLength(1)
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({ example: 'Product description' })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiPropertyOptional({
    example: 'Brand UUID or null to clear',
    nullable: true,
  })
  @IsUUID()
  @IsOptional()
  readonly brandId?: string | null;

  @ApiPropertyOptional({ example: 'Category UUID' })
  @IsUUID()
  @IsOptional()
  readonly categoryId?: string;

  @ApiPropertyOptional({ example: 'Level UUID' })
  @IsUUID()
  @IsOptional()
  readonly levelId?: string;

  @ApiPropertyOptional({ example: 'Finish UUID' })
  @IsUUID()
  @IsOptional()
  readonly finishId?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  readonly isActive?: boolean;
}
