import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { ReturnReason } from '../../../domain/enums/return-reason.enum';

export class AddReturnItemDto {
  @ApiProperty({ example: 'uuid-slab' })
  @IsUUID()
  slabId: string;

  @ApiProperty({ example: 'uuid-bundle' })
  @IsUUID()
  bundleId: string;

  @ApiProperty({ enum: ReturnReason, example: ReturnReason.DEFECTIVE })
  @IsEnum(ReturnReason)
  reason: ReturnReason;

  @ApiProperty({ example: 'Losa con grieta visible', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 150.0 })
  @IsNumber()
  @IsPositive()
  unitCost: number;
}
