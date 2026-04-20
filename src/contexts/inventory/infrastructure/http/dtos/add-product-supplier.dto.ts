import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsUUID } from 'class-validator';

export class AddProductSupplierDto {
  @ApiProperty({ example: 'uuid-supplier' })
  @IsUUID()
  supplierId: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsBoolean()
  isPrimary: boolean = false;
}
