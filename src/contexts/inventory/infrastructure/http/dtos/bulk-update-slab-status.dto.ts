import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsEnum, IsUUID } from 'class-validator';
import { SlabStatus } from '@contexts/inventory/domain/enums/slab-status.enum';

export class BulkUpdateSlabStatusDto {
  @ApiProperty({
    type: [String],
    minItems: 1,
    description: 'List of slab UUIDs to update',
    example: ['uuid-1', 'uuid-2'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  slabIds: string[];

  @ApiProperty({
    enum: SlabStatus,
    description: 'Target status for all slabs',
    example: SlabStatus.RESERVED,
  })
  @IsEnum(SlabStatus)
  status: SlabStatus;
}
