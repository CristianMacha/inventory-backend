import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateLevelDto {
  @ApiProperty({ example: 'Premium' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiPropertyOptional({ example: 1, description: 'Display sort order' })
  @IsInt()
  @Min(0)
  @IsOptional()
  readonly sortOrder?: number;

  @ApiPropertyOptional({ example: 'Nivel premium de calidad' })
  @IsString()
  @IsOptional()
  readonly description?: string;
}
