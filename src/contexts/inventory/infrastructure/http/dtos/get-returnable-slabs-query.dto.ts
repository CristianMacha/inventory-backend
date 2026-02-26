import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetReturnableSlabsQueryDto {
  @ApiProperty({ description: 'Purchase invoice UUID' })
  @IsUUID()
  @IsNotEmpty()
  purchaseInvoiceId: string;

  @ApiPropertyOptional({ description: 'Filter by bundle UUID' })
  @IsUUID()
  @IsOptional()
  bundleId?: string;
}
