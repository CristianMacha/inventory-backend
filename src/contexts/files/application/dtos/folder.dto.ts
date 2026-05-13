import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FolderDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Contratos 2024' })
  name: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  parentId: string | null;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  organizationId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  createdByUserId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
