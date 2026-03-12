import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MaterialMovementReason } from '../../domain/enums/material-movement-reason.enum';

export class MaterialMovementDto {
  @ApiProperty() id: string;
  @ApiProperty() materialId: string;
  @ApiProperty() delta: number;
  @ApiProperty({ enum: MaterialMovementReason }) reason: MaterialMovementReason;
  @ApiPropertyOptional() jobId: string | null;
  @ApiPropertyOptional() notes: string | null;
  @ApiProperty() createdBy: string;
  @ApiProperty() createdAt: string;
}
