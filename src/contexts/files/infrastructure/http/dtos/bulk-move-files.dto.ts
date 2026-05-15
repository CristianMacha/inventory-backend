import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString, IsUUID } from 'class-validator';

export class BulkMoveFilesDto {
  @ApiProperty({
    example: ['uuid-1', 'uuid-2'],
    description: 'List of file UUIDs to move',
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsUUID('4', { each: true })
  readonly fileIds: string[];

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Target folder UUID',
  })
  @IsString()
  @IsUUID()
  readonly targetFolderId: string;
}
