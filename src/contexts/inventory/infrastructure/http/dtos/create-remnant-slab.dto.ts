import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRemnantSlabDto {
  @ApiProperty({ example: 'REM-001' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  code: string;

  @ApiProperty({ example: 45.0 })
  @IsNumber()
  @Min(0.01)
  widthCm: number;

  @ApiProperty({ example: 30.0 })
  @IsNumber()
  @Min(0.01)
  heightCm: number;

  @ApiPropertyOptional({ example: 'Sobra en buen estado' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
