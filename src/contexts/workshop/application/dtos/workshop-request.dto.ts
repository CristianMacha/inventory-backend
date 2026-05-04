import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RequestStatus } from '../../domain/enums/request-status.enum';
import { RequestType } from '../../domain/enums/request-type.enum';
import { RequestPriority } from '../../domain/enums/request-priority.enum';

export class WorkshopRequestDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: RequestType })
  requestType: RequestType;

  @ApiProperty()
  itemId: string;

  @ApiPropertyOptional()
  quantity: number | null;

  @ApiPropertyOptional()
  jobId: string | null;

  @ApiProperty({ enum: RequestPriority })
  priority: RequestPriority;

  @ApiPropertyOptional()
  notes: string | null;

  @ApiProperty({ enum: RequestStatus })
  status: RequestStatus;

  @ApiProperty()
  requestedBy: string;

  @ApiProperty()
  requestedByName: string;

  @ApiPropertyOptional()
  resolvedBy: string | null;

  @ApiPropertyOptional()
  resolvedByName: string | null;

  @ApiPropertyOptional()
  resolvedAt: string | null;

  @ApiPropertyOptional()
  rejectionReason: string | null;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
