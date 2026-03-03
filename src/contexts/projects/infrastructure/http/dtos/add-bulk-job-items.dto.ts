import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BulkJobItemDto {
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

export class AddBulkJobItemsDto {
  @ApiProperty({ type: [BulkJobItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BulkJobItemDto)
  readonly items: BulkJobItemDto[];
}
