import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SlabStatus } from '@contexts/inventory/domain/enums/slab-status.enum';

export class UpdateSlabDto {
  @ApiPropertyOptional({
    enum: SlabStatus,
    description: 'New status for the slab',
    example: SlabStatus.RESERVED,
  })
  @IsEnum(SlabStatus)
  @IsOptional()
  readonly status?: SlabStatus;

  @ApiPropertyOptional({
    example: 'Updated description for this slab',
    description: 'Optional slab description',
  })
  @IsString()
  @IsOptional()
  readonly description?: string;
}
