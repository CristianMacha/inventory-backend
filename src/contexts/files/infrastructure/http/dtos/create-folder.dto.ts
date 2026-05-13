import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateFolderDto {
  @ApiProperty({ example: 'Contratos 2024' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiPropertyOptional({ example: 'uuid-of-parent-folder' })
  @IsUUID()
  @IsOptional()
  readonly parentId?: string;

  @ApiProperty({ example: 'uuid-of-organization' })
  @IsUUID()
  @IsNotEmpty()
  readonly organizationId: string;
}
