import { ApiProperty } from '@nestjs/swagger';
import { SlabStatus } from '@contexts/inventory/domain/enums/slab-status.enum';

export class ISlabOutputDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'uuid-bundle' })
  bundleId: string;

  @ApiProperty({ example: 'SLB-001' })
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

  @ApiProperty({ example: 'uuid-user' })
  createdBy: string;

  @ApiProperty({ example: 'uuid-user' })
  updatedBy: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: string;
}
