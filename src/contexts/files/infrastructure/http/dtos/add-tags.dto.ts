import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class AddTagsDto {
  @ApiProperty({ example: ['factura', 'proveedor', '2024'] })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  readonly tags: string[];
}
