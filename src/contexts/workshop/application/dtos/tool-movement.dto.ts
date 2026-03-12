import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ToolStatus } from '../../domain/enums/tool-status.enum';

export class ToolMovementDto {
  @ApiProperty() id: string;
  @ApiProperty() toolId: string;
  @ApiProperty({ enum: ToolStatus }) previousStatus: ToolStatus;
  @ApiProperty({ enum: ToolStatus }) newStatus: ToolStatus;
  @ApiPropertyOptional() jobId: string | null;
  @ApiPropertyOptional() notes: string | null;
  @ApiProperty() createdBy: string;
  @ApiProperty() createdAt: string;
}
