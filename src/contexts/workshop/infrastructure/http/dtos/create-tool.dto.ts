import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateToolDto {
  @ApiProperty({ example: 'Taladro de impacto' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiPropertyOptional({ example: 'Taladro de 18V con batería' })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  readonly categoryId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  readonly supplierId?: string;

  @ApiPropertyOptional({ example: 150.00 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly purchasePrice?: number;
}
