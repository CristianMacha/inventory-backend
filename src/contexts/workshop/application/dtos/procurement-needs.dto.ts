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

export class ApprovedRequestStockGapDto {
  @ApiProperty()
  requestId: string;

  @ApiProperty()
  materialId: string;

  @ApiProperty()
  materialName: string;

  @ApiProperty()
  unit: string;

  @ApiProperty()
  requestedQuantity: number;

  @ApiProperty()
  currentStock: number;

  @ApiProperty({ description: 'requestedQuantity - currentStock' })
  shortfall: number;

  @ApiProperty({ enum: RequestPriority })
  priority: RequestPriority;

  @ApiProperty()
  requestedBy: string;

  @ApiProperty()
  createdAt: string;
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
