import { ApiProperty } from '@nestjs/swagger';

export class BulkCreateSlabsOutputDto {
  @ApiProperty({ example: 10, description: 'Number of slabs created' })
  count: number;
}

export class SlabUpdateFailureDto {
  @ApiProperty({ example: 'uuid-slab' })
  slabId: string;

  @ApiProperty({ example: 'Invalid status transition: SOLD -> AVAILABLE' })
  reason: string;
}

export class BulkUpdateSlabStatusOutputDto {
  @ApiProperty({
    example: 8,
    description: 'Number of slabs successfully updated',
  })
  updated: number;

  @ApiProperty({
    type: [SlabUpdateFailureDto],
    description: 'Slabs that could not be updated',
  })
  failed: SlabUpdateFailureDto[];
}
