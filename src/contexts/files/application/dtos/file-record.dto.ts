import { ApiProperty } from '@nestjs/swagger';

export class FileRecordDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'contrato-proveedor.pdf' })
  name: string;

  @ApiProperty({ example: 'application/pdf' })
  mimeType: string;

  @ApiProperty({ example: 204800, description: 'File size in bytes' })
  sizeBytes: number;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  folderId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  organizationId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  createdByUserId: string;

  @ApiProperty({ example: ['factura', 'proveedor', '2024'], type: [String] })
  tags: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
