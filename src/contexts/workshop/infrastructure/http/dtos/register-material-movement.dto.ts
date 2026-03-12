import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, NotEquals } from 'class-validator';
import { MaterialMovementReason } from '../../../domain/enums/material-movement-reason.enum';

export class RegisterMaterialMovementDto {
  @ApiProperty({ description: 'Signed quantity: positive = entry, negative = exit/adjustment', example: 50 })
  @IsNumber()
  @NotEquals(0, { message: 'delta cannot be zero' })
  readonly delta: number;

  @ApiProperty({ enum: MaterialMovementReason })
  @IsEnum(MaterialMovementReason)
  @IsNotEmpty()
  readonly reason: MaterialMovementReason;

  @ApiPropertyOptional({ description: 'Associated job ID' })
  @IsUUID()
  @IsOptional()
  readonly jobId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly notes?: string;
}
