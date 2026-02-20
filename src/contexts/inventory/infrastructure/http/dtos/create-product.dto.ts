import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Calacatta Gold' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 'Category UUID' })
  @IsUUID()
  @IsNotEmpty()
  readonly categoryId: string;

  @ApiProperty({ example: 'Level UUID' })
  @IsUUID()
  @IsNotEmpty()
  readonly levelId: string;

  @ApiProperty({ example: 'Finish UUID' })
  @IsUUID()
  @IsNotEmpty()
  readonly finishId: string;

  @ApiPropertyOptional({ example: 'Product description' })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiPropertyOptional({ example: 'Brand UUID' })
  @IsUUID()
  @IsOptional()
  readonly brandId?: string;
}
