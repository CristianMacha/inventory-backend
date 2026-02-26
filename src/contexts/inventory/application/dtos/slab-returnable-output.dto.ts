import { ApiProperty } from '@nestjs/swagger';
import { SlabStatus } from '@contexts/inventory/domain/enums/slab-status.enum';

export class SlabReturnableOutputDto {
  @ApiProperty({ example: 'uuid-slab' })
  id: string;

  @ApiProperty({ example: 'uuid-bundle' })
  bundleId: string;

  @ApiProperty({ example: 'LOT-001' })
  lotNumber: string;

  @ApiProperty({ example: 'SLB-003' })
  code: string;

  @ApiProperty({ example: 150.5 })
  widthCm: number;

  @ApiProperty({ example: 280.0 })
  heightCm: number;

  @ApiProperty({ example: '150.50 x 280.00 cm' })
  dimensions: string;

  @ApiProperty({ enum: SlabStatus, example: SlabStatus.AVAILABLE })
  status: SlabStatus;

  @ApiProperty({ example: 'Losa sin defectos', required: false })
  description: string;
}
