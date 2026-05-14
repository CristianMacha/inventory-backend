import { ApiProperty } from '@nestjs/swagger';

export class OrganizationDto {
  @ApiProperty({ example: 'a1b2c3d4-...' })
  id: string;

  @ApiProperty({ example: 'Acme Corp' })
  name: string;

  @ApiProperty({ example: 10737418240, description: 'Storage quota in bytes' })
  storageLimitBytes: number;

  @ApiProperty({ example: 524288000, description: 'Storage used in bytes' })
  storageUsedBytes: number;

  @ApiProperty({ example: 'user-uuid' })
  createdBy: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
