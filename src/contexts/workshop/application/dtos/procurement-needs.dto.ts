import { ApiProperty } from '@nestjs/swagger';
import { RequestPriority } from '../../domain/enums/request-priority.enum';

export class MaterialBelowMinStockDto {
  @ApiProperty()
  materialId: string;

  @ApiProperty()
  materialName: string;

  @ApiProperty()
  unit: string;

  @ApiProperty()
  currentStock: number;

  @ApiProperty()
  minStock: number;

  @ApiProperty({ description: 'minStock - currentStock' })
  deficit: number;

  @ApiProperty({ nullable: true })
  supplierId: string | null;
}

export class UnfulfilledRequestDto {
  @ApiProperty()
  requestId: string;

  @ApiProperty()
  requestedQuantity: number;

  @ApiProperty({
    description: 'Stock available when this request was processed (FIFO)',
  })
  availableStock: number;

  @ApiProperty()
  shortfall: number;

  @ApiProperty({ enum: RequestPriority })
  priority: RequestPriority;

  @ApiProperty()
  requestedBy: string;

  @ApiProperty()
  requestedByName: string;

  @ApiProperty()
  createdAt: string;
}

export class ApprovedRequestStockGapDto {
  @ApiProperty()
  materialId: string;

  @ApiProperty()
  materialName: string;

  @ApiProperty()
  unit: string;

  @ApiProperty({ description: 'Current stock of the material' })
  currentStock: number;

  @ApiProperty({
    description:
      'Total shortfall across all unfulfilled requests for this material',
  })
  totalShortfall: number;

  @ApiProperty({ type: () => UnfulfilledRequestDto, isArray: true })
  unfulfilledRequests: UnfulfilledRequestDto[];
}

export class ToolInRepairDto {
  @ApiProperty()
  toolId: string;

  @ApiProperty()
  toolName: string;

  @ApiProperty({ nullable: true })
  categoryId: string | null;
}

export class ProcurementNeedsDto {
  @ApiProperty({ type: () => MaterialBelowMinStockDto, isArray: true })
  materialsBelowMinStock: MaterialBelowMinStockDto[];

  @ApiProperty({ type: () => ApprovedRequestStockGapDto, isArray: true })
  approvedRequestsWithInsufficientStock: ApprovedRequestStockGapDto[];

  @ApiProperty({ type: () => ToolInRepairDto, isArray: true })
  toolsInRepair: ToolInRepairDto[];
}
