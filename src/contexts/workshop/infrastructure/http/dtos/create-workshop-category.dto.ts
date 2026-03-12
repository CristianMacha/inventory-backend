import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorkshopCategoryDto {
  @ApiProperty({ example: 'Herramientas eléctricas' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly description?: string;
}
