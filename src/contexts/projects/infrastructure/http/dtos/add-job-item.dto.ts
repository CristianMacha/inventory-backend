import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class AddJobItemDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  readonly slabId: string;

  @ApiPropertyOptional({ example: 'Granito Blanco Polar - Slab SLB-001' })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiProperty({ example: 350.0 })
  @IsNumber()
  @Min(0)
  readonly unitPrice: number;
}
